// Small seeded generator; every staged frame uses its query seed.
export function makeRandom(seed = 1) {
  let value = (Number(seed) >>> 0) || 1;
  return () => {
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}
