export function calculateOffset({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number {
  return Math.max(0, (page - 1) * limit);
}
