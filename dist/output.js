const outputModifier = (text2) => {
  const modifiedText = text2.replace(/n'tt/g, "n't").replace(/\s+\n+/g, "\n\n").replace(/Aa+h!/g, "Ah!");
  return { text: modifiedText };
};
outputModifier(text);
