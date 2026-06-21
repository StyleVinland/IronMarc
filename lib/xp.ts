export const XP_BY_TYPE: Record<string, number> = {
  swim: 60,
  run: 55,
  bike: 50,
  brick: 75,
  renfo: 40,
  rest: 0,
};

export const XP_NOTES_BONUS = 20;

export function computeXp(sessionType: string, status: string, notes: string): number {
  if (!['done', 'modified'].includes(status)) return 0;
  const base = XP_BY_TYPE[sessionType] ?? 50;
  const bonus = notes.trim().length >= 10 ? XP_NOTES_BONUS : 0;
  return base + bonus;
}
