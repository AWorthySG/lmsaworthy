const STORAGE_KEY = 'aworthy-saved-offline';

function getSavedIds() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
}

function persistIds(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch { /* quota */ }
}

export function isSavedOffline(resourceId) {
  return getSavedIds().has(resourceId);
}

export function getAllSavedIds() {
  return getSavedIds();
}

export async function saveResourceOffline(resourceId, fileUrl) {
  if (!fileUrl) return false;
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_RESOURCE', url: fileUrl });
    }
    const ids = getSavedIds();
    ids.add(resourceId);
    persistIds(ids);
    return true;
  } catch {
    return false;
  }
}

export function removeResourceOffline(resourceId, fileUrl) {
  if (fileUrl && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'UNCACHE_RESOURCE', url: fileUrl });
  }
  const ids = getSavedIds();
  ids.delete(resourceId);
  persistIds(ids);
}
