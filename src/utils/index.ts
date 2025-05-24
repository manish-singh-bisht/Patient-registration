export function calculateOffset({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number {
  return Math.max(0, (page - 1) * limit);
}

export const normalizeEmptyString = ({
  value,
}: {
  value: string | undefined;
}) => {
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
};
