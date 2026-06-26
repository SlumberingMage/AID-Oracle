const normalize = (s) => (s || "").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const removeHistoryEcho = (output, history) => {
  if (!output || !history || !history.length)
    return output;
  const lastAction = history[history.length - 1]?.text || "";
  const source = normalize(lastAction);
  let result = output;
  if (!source)
    return result;
  const candidates = [
    ...source.split(/\n\s*\n/),
    ...source.match(/[^.!?]+[.!?]+["']?/g) || []
  ].map(normalize).filter((s) => s.length >= 40).sort((a, b) => b.length - a.length);
  for (const candidate of candidates) {
    const pattern = new RegExp(
      "^\\s*" + escapeRegExp(candidate).replace(/\s+/g, "\\s+"),
      "i"
    );
    if (pattern.test(result)) {
      result = result.replace(pattern, "").trimStart();
      break;
    }
  }
  return result;
};
