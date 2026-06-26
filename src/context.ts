// Every script needs a modifier function.
const contextModifier = (text: string): AiDungeonReturn => {

  return { text }
}

// Don't modify this part.
contextModifier(text)
