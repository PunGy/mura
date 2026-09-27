/**
 * Get random float number between min(inclusive) and max(exclusive)
 */
export function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Get random integer number between min(inclusive) and max(exclusive)
 */
export function randInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
