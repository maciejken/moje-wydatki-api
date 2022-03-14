export const roundNum = (num: number, prec = 2) => {
  const powOfTen = Math.pow(10, prec);
  return Math.round(powOfTen * num) / powOfTen;
};
