const inputModifier = (text2) => {
  const playerName = state.placeholders?.find((p) => p.question === "character.name")?.answer;
  text2 = text2.replace(`
> ${playerName} says,`, `> ${playerName} said,`).replace(/ʻ|’/g, "'").replace(/“|”/g, '"');
  if (text2.startsWith(`
> ${playerName} /`) && text2.split("/").length > -1) {
    text2 = `> ${text2.split("/c ")[1]}`;
  }
  return { text: text2 };
};
inputModifier(text);
