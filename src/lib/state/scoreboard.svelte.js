import { browser } from '$app/environment';

// The best score, shared across the whole app: the 2048 page writes it and the
// home page reads it. Module-level state, so every importer sees one value.
const STORAGE_KEY = 'arcade:best-score';

let best = $state(0);
let loaded = $state(false);

export const scoreboard = {
  get best() {
    return best;
  },

  /** True once localStorage has been read, so the UI can wait before claiming 0. */
  get loaded() {
    return loaded;
  },

  /** Reads the stored best score. Safe to call more than once. */
  load() {
    if (!browser || loaded) return;
    loaded = true;
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > best) best = stored;
  },

  /** Keeps the score if it beats the record. */
  record(score) {
    if (score <= best) return;
    best = score;
    if (browser) localStorage.setItem(STORAGE_KEY, String(best));
  },

  clear() {
    best = 0;
    if (browser) localStorage.removeItem(STORAGE_KEY);
  }
};
