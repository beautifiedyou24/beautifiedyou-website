export const parseDate = (dateString: any) => {
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
  const day = parts[2] ? parseInt(parts[2], 10) : 1;
  return new Date(year, month, day);
};
