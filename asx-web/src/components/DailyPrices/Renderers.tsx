export const dateRenderer = (date: Date): string => {
  const day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
