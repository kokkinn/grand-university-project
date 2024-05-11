/**
 * Function to get a random number from a range
 * @param {number} min inclusive start of the range
 * @param {number} max inclusive end of the range
 * @return {number} A pseudo random number form a given range
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Calculates a vector length based on its coordinates
 * @param {number} x x vector coordinate
 * @param {number} y x vector coordinate
 * @return A vector magnitude {number}
 */
function getVectorMagnitude(x, y) {
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates a unit vector from a normal one
 * @param {number} x x vector coordinate
 * @param {number} y x vector coordinate
 * @return {number[]} a list of two elements representing x and y coordinate of unit vector
 */
function getUnitVector(x, y) {
  const initMagnitude = getVectorMagnitude(x, y);
  return [x / initMagnitude, y / initMagnitude];
}

/**
 * Calculates random hexadecimal value which is a colour
 * @return hexadecimal value {string}
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export {
  randomIntFromInterval,
  getRandomColor,
  getUnitVector,
  getVectorMagnitude,
};
