/**
 * Oracle Lite
 *
 * Summary:
 * ### The plan:
 *
 * 1. **Generalize the Dice**: We'll use an N-sided dice. Each outcome has a probability of `1/N`.
 *
 * 2. **Threshold Comparison**: Given a target threshold \( T \), we need to assess the rolled number \( R \) relative to \( T \). If \( R \) is below \( T \), it’s some form of failure. If \( R \) is at or above \( T \), it's a success.
 *
 * 3. **Six Degrees of Success**:
 *   - **"No, and"**: A bad failure (low roll far below the threshold).
 *   - **"No"**: A regular failure (roll somewhat below the threshold).
 *   - **"No, but"**: A near miss (roll just under the threshold).
 *   - **"Yes, but"**: A weak success (roll barely above the threshold).
 *   - **"Yes"**: A solid success (roll moderately above the threshold).
 *   - **"Yes, and"**: A critical success (roll far above the threshold).
 *
 * 4. **Normalize Probabilities**: We'll express the probability of each outcome as a percentage of the total probability range. To split this range into six degrees, we can normalize the gap between the roll and the target and assign results based on how "extreme" the result is.
 *
 * ### Breaking it Down into Probability Ranges:
 *
 * Let’s define how we break down the rolls into degrees based on how far the roll \( R \) is from the threshold \( T \):
 *
 * - **Failure Range** (\( R < T \)):
 *  - "No, and": The roll is very low, say the bottom third of possible failures.
 *  - "No": The roll is a medium failure, in the middle range below the target.
 *  - "No, but": The roll is just below the target (near-miss).
 *
 * - **Success Range** (\( R \geq T \)):
 *  - "Yes, but": The roll just barely meets or exceeds the target.
 *  - "Yes": A solid success, somewhere in the middle range above the target.
 *  - "Yes, and": A top-end success, close to the highest possible roll.
 *
 * ### Example Approach for a General N-sided Dice:
 *
 * Assume the user inputs a number \( N \) for the number of sides, and a threshold \( T \) for the target number.
 *
 *  * 1. **Failure Breakdown**:
 *   - If \( R < T \), split the range \( [1, T-1] \) into thirds:
 *     - Bottom third: "No, and"
 *     - Middle third: "No"
 *     - Top third (near \( T \)): "No, but"
 *
 * 2. **Success Breakdown**:
 *   - If \( R \geq T \), split the range \( [T, N] \) into thirds:
 *     - Bottom third (just over \( T \)): "Yes, but"
 *     - Middle third: "Yes"
 *     - Top third (near \( N \)): "Yes, and"
 *
 * ### Probability Calculation:
 *
 * For any roll \( R \), the degrees of success could be defined as:
 *
 * - **Failure cases**:
  - \( P(R < T) \) is the sum of probabilities for all numbers less than \( T \), i.e., \( \frac{T-1}{N} \).
 *
 * - **Success cases**:
  - \( P(R \geq T) \) is the probability of rolling \( T \) or higher, i.e., \( \frac{N-T+1}{N} \).
 *
 * ### Dynamic Mapping:
 *
 * To dynamically adjust for the probability, you can use ranges like this:
 *
 * - For failure cases:
 *   - "No, and" would be for values where \( R \) is in the bottom third of the failure range.
 *   - "No" for the middle third.
 *   - "No, but" for rolls just below \( T \).
 *
 * - For success cases:
 *   - "Yes, but" is for rolls just above \( T \) (bottom third of the success range).
 *   - "Yes" for the middle range of successes.
 *   - "Yes, and" for rolls near the maximum \( N \) (top third of the success range).
 *
 * The nice thing here is that as \( N \) changes, the system adjusts automatically since the ranges are all based on relative probability instead of hard numbers.
 *
 * Default phrasing to check for and parse the commands: `\n> ${who} /${commands}".\n`.
 * Examples with three use cases:
 * - Use Case 1: '\n> John /tres /to pick the lock.\n'
 * - Use Case 2: '\n> You /try /to open the door /roll 100% /target 50% /rolled 70%.\n'
 * - Use Case 2: '\n> You /attempt /to climb the wall /roll 20 /target 11 /rolled 9.\n'
 * - Use Case 3: '\n> Jane /tries /to charm the guard.\n'
 * - Use Case 4: '\n> You /tried /to open the door.\n'
 *
 *
 * The script will look for the word following the `/` and then the action, this is to allow flexibility in the phrasing, due to not knowing the players POV for the game, they can use all POVs First, Second, and Third.
 */

// Do NOT modify below this line.
// Here there be dragons!
//      🐉
// (°ロ°)☝ (°ー°〃)✧

// const { getModuleCommands } = require('../lib/get.module.commands')


// module.exports = { main }
