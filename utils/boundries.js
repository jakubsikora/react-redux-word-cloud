/**
 * Calculate boundries based on given words and limit of boundries.
 * @param {Array} words Array of words
 * @param {Number} n Number of boundries to be generated
 * @returns {Array} Array of boundries
 */
export function getBoundries(words, n) {
  function arrayMin(arr) {
    return arr.reduce((a, b) => (a < b ? a : b));
  }

  function arrayMax(arr) {
    return arr.reduce((a, b) => (a > b ? a : b));
  }

  if (n === 0) return [];

  // Calculate max volume from given words
  const max = arrayMax(words.map(word => word.volume));

  // Calculate min volume from given words
  const min = arrayMin(words.map(word => word.volume));

  // Calculate even division
  const division = parseInt(Math.ceil((max - min) / n), 10);
  let bounds = [];

  // Generate boundries
  for (let i = 0; i < n; i++) {
    bounds.push(i * division);
  }

  return bounds;
}

/**
 * Return min bound for given number and boundries
 * @param {Number} number Value to be checked against boundries
 * @param {Array} bounds Given boundries
 * @returns {Number} Value of min bound for given number.
 */
export function getMinBound(number, bounds) {
  let bound;
  bounds.some(item => {
    if (number < item) {
      return true;
    }

    bound = item;
  });

  return bound;
}
