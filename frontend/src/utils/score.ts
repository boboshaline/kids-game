export function calculateScore(
  base: number,
  streak: number,
  timeTakenMs: number
) {
  const speedBonus = Math.max(0, 3000 - timeTakenMs) / 1000;
  return base + streak * 2 + Math.floor(speedBonus);
}
