// A seeded random number generator (mulberry32).
//
// The package's `spawn` takes any function returning a number in [0, 1), so
// handing it one of these makes a game replayable: the same seed always puts
// the same tiles in the same squares. The whole state is one 32-bit integer,
// which is what lets a game in progress survive a reload.
export function createRandom(seed) {
  let a = seed >>> 0;

  return {
    next() {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    get state() {
      return a;
    },
    set state(value) {
      a = value | 0;
    }
  };
}

/**
 * Turns whatever someone typed into a seed. Digits are used as a number, any
 * other text is hashed, and blank input means "no seed".
 */
export function toSeed(input) {
  const text = String(input ?? '').trim();
  if (text === '') return null;
  if (/^\d+$/.test(text)) return Number(text) >>> 0;

  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
