const processItems = (items, severityThreshold) => {
  // Filter out items below the severity threshold
  const filteredItems = items.filter(item => item.severity > severityThreshold)

  // Sort items by severity in descending order
  filteredItems.sort((a, b) => b.severity - a.severity)

  // Group by type and count occurrences
  const counts = {}
  filteredItems.forEach(item => {
    counts[item.type] = (counts[item.type] || 0) + 1
  })

  // Return counts as an array of objects with type and count properties
  return Object.entries(counts).map(([type, count]) => ({ type, count }))
}
module.exports = processItems
