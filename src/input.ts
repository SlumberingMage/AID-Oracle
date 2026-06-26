// Every script needs a modifier function.
const inputModifier = (text: string): AiDungeonReturn => {
  const playerName = state.placeholders?.find(p => p.question === 'character.name')?.answer
  // const playerNickname = state.placeholders?.find(p => p.question === 'What is your nickname?')?.answer
  // Any other input modifier scripts can go here
  text = text.replace(`\n> ${playerName} says,`, `> ${playerName} said,`)
    .replace(/ʻ|’/g, "'")
    .replace(/“|”/g, '"');

  // Check user input for /c to switch active player on the fly.
  if (text.startsWith(`\n> ${playerName} /`) && text.split("/").length > -1) {
    text = `> ${text.split("/c ")[1]}`
  }

  // const authors_notes = storyCards.find(x => x.keys === "name=Author's Notes")
  // state.memory.authorsNote = authors_notes.entry
  return { text };
}

// Don't modify this part.
inputModifier(text)
