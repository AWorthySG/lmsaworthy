import { useState, useCallback, useRef, useEffect } from "react";

export default function useTimer(totalMinutes, onEnd) {
  const [seconds, setSeconds] = useState(totalMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const start = useCallback(() => { clearInterval(intervalRef.current); setRunning(true); intervalRef.current = setInterval(() => { setSeconds((prev) => { if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); onEnd?.(); return 0; } return prev - 1; }); }, 1000); }, [onEnd]);
  const stop = useCallback(() => { clearInterval(intervalRef.current); setRunning(false); }, []);
  useEffect(() => () => clearInterval(intervalRef.current), []);
  const display = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  return { seconds, display, running, start, stop };
}
