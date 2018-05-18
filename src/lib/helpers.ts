// https://www.arduino.cc/reference/en/language/functions/math/map/
export const map = (x, in_min, in_max, out_min, out_max) => {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
