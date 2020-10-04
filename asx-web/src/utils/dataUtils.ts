export const formatToDecimals = (value: number, numDecimals: number): number => {
  return Number(value.toFixed(numDecimals));
};
