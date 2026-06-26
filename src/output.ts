const outputModifier = (text: string): AiDungeonReturn => {
  // Any other output modifier scripts can go here
  // replace
  // - "didn'tt", "didn't"
  // - "hasn'tt", "hasn't"
  // - "doesn'tt", "doesn't"
  // - "couldn'tt", "couldn't"
  // - "wasn'tt", "wasn't"
  const modifiedText = text.replace(/n'tt/g, "n't")
      .replace(/\s+\n+/g, "\n\n")
      .replace(/Aa+h!/g, "Ah!");
  return { text: modifiedText };
}

// Don't modify this part
outputModifier(text)
