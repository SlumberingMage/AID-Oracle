/**
 * Gets a random item from an array.
 * @param {array} arr Array of items.
 * @returns Random item from the array or an empty string if array is empty.
 */
const getRandomItem = (arr) => arr.length ? arr[Math.floor(Math.random() * arr.length)] : ''
module.exports = getRandomItem
