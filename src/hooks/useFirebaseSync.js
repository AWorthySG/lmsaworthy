import { useEffect, useRef } from "react";
import { firebaseDb, ref, set, onValue, get } from "../config/firebase.js";
import { PERSIST_KEYS } from "../state/persistence.js";

/**
 * Custom hook that syncs persisted state to Firebase Realtime Database per user.
 * - On mount (when authUser exists), loads state from Firebase and merges it
 *   with localStorage state (Firebase takes priority).
 * - Debounces writes: after state changes, waits 2 seconds then writes
 *   PERSIST_KEYS fields to Firebase.
 * - Handles offline gracefully with try/catch around Firebase calls.
 *
 * Requires a "MERGE_FIREBASE_STATE" reducer action that merges payload into state.
 */
export default function useFirebaseSync(authUser, state, dispatch) {
  const debounceRef = useRef(null);
  const initialLoadDoneRef = useRef(false);

  // On mount: load state from Firebase and merge with local state
  useEffect(() => {
    if (!authUser?.uid) {
      initialLoadDoneRef.current = false;
      return;
    }

    const userStatePath = `users/${authUser.uid}/state`;

    // Try to load initial snapshot
    async function loadInitial() {
      try {
        const snapshot = await get(ref(firebaseDb, userStatePath));
        const firebaseState = snapshot.val();
        if (firebaseState && typeof firebaseState === "object") {
          // Merge Firebase state into current state (Firebase takes priority)
          const merged = {};
          PERSIST_KEYS.forEach((key) => {
            if (firebaseState[key] !== undefined) {
              merged[key] = firebaseState[key];
            }
          });
          if (Object.keys(merged).length > 0) {
            dispatch({ type: "MERGE_FIREBASE_STATE", payload: merged });
          }
        }
        initialLoadDoneRef.current = true;
      } catch (err) {
        // Offline or Firebase error — continue with localStorage state
        console.warn("[useFirebaseSync] Could not load from Firebase:", err);
        initialLoadDoneRef.current = true;
      }
    }

    loadInitial();

    // Listen for realtime changes from other devices/tabs
    let unsubscribe;
    try {
      unsubscribe = onValue(
        ref(firebaseDb, userStatePath),
        (snapshot) => {
          // Skip the first callback since we already handled it via get()
          if (!initialLoadDoneRef.current) return;
          const firebaseState = snapshot.val();
          if (firebaseState && typeof firebaseState === "object") {
            const merged = {};
            PERSIST_KEYS.forEach((key) => {
              if (firebaseState[key] !== undefined) {
                merged[key] = firebaseState[key];
              }
            });
            if (Object.keys(merged).length > 0) {
              dispatch({ type: "MERGE_FIREBASE_STATE", payload: merged });
            }
          }
        },
        (err) => {
          console.warn("[useFirebaseSync] Realtime listener error:", err);
        }
      );
    } catch (err) {
      console.warn("[useFirebaseSync] Could not set up realtime listener:", err);
    }

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [authUser?.uid, dispatch]);

  // Debounced write: after state changes, wait 2 seconds then write to Firebase
  useEffect(() => {
    if (!authUser?.uid) return;
    if (!initialLoadDoneRef.current) return;

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const userStatePath = `users/${authUser.uid}/state`;
      const toSync = {};
      PERSIST_KEYS.forEach((key) => {
        toSync[key] = state[key];
      });

      try {
        set(ref(firebaseDb, userStatePath), toSync);
      } catch (err) {
        console.warn("[useFirebaseSync] Could not write to Firebase:", err);
      }
    }, 2000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [authUser?.uid, state]);
}
