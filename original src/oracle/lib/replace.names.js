/**
 * Replaces names in the text based on tags.
 * @param {string} text The text to replace names in.
 * @param {object} names An object containing the names to replace and the names to replace them with. The names to replace are in the toReplace property and the names to replace them with are in the replaceWith property.
 * @returns The text with the names replaced.
 */
function replaceNames (text, names) {
  const { toReplace, replaceWith } = names

  // Helper function to find matching names based on tags
  function findMatchingNames (tags) {
    return replaceWith.filter(replaceName =>
      replaceName.tags.some(tag => tags.includes(tag))
    )
  }

  // Replace names in the text
  toReplace.forEach(replaceName => {
    const matchingNames = findMatchingNames(replaceName.tags)
    if (matchingNames.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingNames.length)
      const randomName = matchingNames[randomIndex].name
      const regex = new RegExp(`\\b${replaceName.name}\\b`, 'g')
      text = text.replace(regex, randomName)
    }
  })

  return text
}
module.exports = replaceNames
