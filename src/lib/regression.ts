function calculateRegressionY(x: number): number {
  // https://www.desmos.com/calculator
  // https://mycurvefit.com/share/e022c413-7d07-4faf-b008-833cb3443b72
  const a = 4.8;
  const b = 6.9;
  const c = 0.8;

  return a - b / Math.pow(2, x / c);
}

export function calculateRegressionPoints(): any[] {
  let points = [];

  for (let index = 0; index <= 10; index++) {
    points.push([index * 0.5, calculateRegressionY(index * 0.5)]);
  }

  return points;
}
