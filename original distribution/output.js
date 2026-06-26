const modifier = (text) => {
  // Prevent the AI from seeing success and failure always even when doing a continue action.
  state.memory.frontMemory = '';

  return { text }
}

// Don't modify this part
modifier(text)