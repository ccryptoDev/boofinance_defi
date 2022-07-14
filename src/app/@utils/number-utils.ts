export function aprToApy(apr: number, periods: number) {
  if (apr && apr > 0) {
    return ((Math.pow((1 + (apr / periods)), periods)) - 1);
  } else {
    return 0;
  }
}
