/**
 * Formats the output text by adjusting new lines based on the provided history.
 *
 * @param {string} outputText - The text to be formatted.
 * @param {Array<Object>} history - An array of objects representing the history of interactions.
 * @param {boolean} [debug=false] - A flag to enable debug logging.
 * @returns {string} The formatted output text with adjusted new lines.
 */
const formatOutput = (outputText, history, debug = false) => {
    const formatNewLines = (str) => str.replace(/(?!\ {2,})[\ \n|\n\ ]{2,}|\n/g, '\n\n')
    // Determines whether to prepend new lines based on sentence count
    const prependNewLines = (str, history) => {
        if (history.length < 1) {
            return str;
        }
        const last = history?.at(-1);
        if (['do', 'say'].includes(type => type === last.type)) {
            return '\n' + str.trimStart();
        }
        if (last.text.endsWith('\n\n')) {
            return str.trimStart();
        }
        if (last.text.endsWith('\n')) {
            return '\n' + str.trimStart();
        }
        const lastParagraph = last.text.split('\n').at(-1) || last.text;
        const lastParagraphSentenceCount = lastParagraph.match(/\w[.?!](\s|$)/g)?.length || 0;

        const currentParagraph = str.split('\n').filter(Boolean)[0] || '';
        const currentParagraphSentenceCount = currentParagraph.match(/\w[.?!](\s|$)/g)?.length || 0;

        // If combined sentences exceed 4, add extra newlines between paragraphs
        if (lastParagraphSentenceCount + currentParagraphSentenceCount > 4) {
            return '\n\n' + str.trimStart(); // Ensures no extra space at the start
        }
        return str;
    };
    const result = prependNewLines(formatNewLines(outputText), history);
    if (debug)
        console.log(`result: "${result}"`);
    return result;
}
module.exports = formatOutput
