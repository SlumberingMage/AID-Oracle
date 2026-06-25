# How to use Scripting in AI Dungeon

![icon](https://assets.super.so/311da5e0-9a02-4177-9f6a-b89435645aea/images/da14e79a-ea29-4006-be4d-82f224c2cff3/code.svg)

Scripting allows creators to modify the player experience beyond what is supported in the Scenario editor.

‣

## Scenarios

Scripts are attached to Scenarios. Adventures started from a Scenario have separate game states but share the same scripts.

Only Simple Start and Character Creator Scenarios can have scripts. Multiple Choice Scenarios can’t have scripts, but can have options that have scripts. Scripts in options for Multiple Choice Scenarios are independent.

‣

## Visibility

Only the creator of a scenario can see the scripts for that scenario.

Scripts for published scenarios may be reviewed as part of moderation to ensure they comply with AI Dungeon’s community guidelines.

‣

## Scripting UI

When editing a simple or character creation scenario, you can open scripting from the bottom of the Details tab.

‣

## Scripts

On the left, you can navigate between the four available scripts. Each script has default text to help you understand how to write your own scripts. For scripts other than Library, the last line must always be `modifier(text)`

- Library - a shared library of functions and values that can be used in other scripts
- Input - a script that should run during the `onInput` hook
- Context - a script that should run during the `onModelContext` hook
- Output - a script that should run during the `onOutput` hook

If you have unsaved changes, a white dot will appear next to the script with unsaved changes.

‣

## Script Test

After selecting a non-library script, you will see the Script Test option in a panel on the right.

‣

### Input

The **Input** text box starts with a default value to illustrate the structure of the inputs available for scripts. You can modify this value to test how your script responds to other inputs.

‣

### Submit

The **Submit** button will send the input, the library, and the script to the server for a test run.

‣

### Output

The **Output** section will then show the results of the test.

- `text` - this the text value returned by the script
- `stop` - this is the stop value returned by the script
- `logs` - this is an array of log outputs from the script
- `state` - this is the updated state object after running the script
- `storyCards` - this is the array of story cards after running the script

‣

## Console Log

After selecting a non-library script, you will see the Console Log option in the panel on the right. This option will show recent console logs from adventures that you personally have started from this scenario. Only console logs from adventures created by the creator of the scenario will show up in the Console Log section.

Console logs are pushed to the Console Log section in real time, so if you can have one tab open with the Scripting Editor and a separate tab open with a play test, you can watch the console logs as they happen.

Logs are saved for 15 minutes.

‣

## Top Navigation Bar

‣

### Back Button

The **back** button takes you back to the Scenario Editor. If you have unsaved changes, pressing the back button will cause a confirmation dialog to appear which will ask you to Save or Discard your unsaved changes.

‣

### Help Button

The **help** button opens this Guidebook article in a new tab, so you have easy access to all of the reference information for the Scripting API.

‣

### Inspect Button

The **inspect** button opens a modal that shows the most recent model context and game state for adventures using the scripts from this scenario.

Only adventures where the owner of the adventure is the owner of the scenario will send model context and game state logs to the inspect modal.

Contents of the inspect modal expire after 15 minutes.

‣

### Play Button

The **play** button starts a new adventure from this scenario in a new tab, so you can easily test changes to your scripts.

When you play a child scenario of a multiple choice scenario, the play button will take you directly to the child scenario, rather than taking you to the menu, which would be the experience for players.

‣

### Save Button

The **save** button saves an unsaved changes.

‣

## Scripting API

‣

## Hooks

The Scripting API consists of three lifecycle hooks.

‣

### `onInput`

The **input** hook allows a script to modify the player’s input text before it is used to construct the model context.

‣

### `onModelContext`

The **model** **context** hook allows a script to change the text sent to the AI model before the model is called.

‣

### `onOutput`

The **output** hook allows a script to modify the model’s output text before it is returned to the player.

Each hook runs in an isolated sandbox with a 16 MB memory limit and a 2-second execution timeout.

‣

## Params

Scripting API hooks have access to the following information. When referencing one of these params in a script, you can reference the name of the parameter directly—you do not need to deconstruct it from an object.

‣

### `text`

For the `onInput` hook, this field has the text entered by the player.

For the `onModelContext` hook, this field has the text that would otherwise be sent to the AI.

For the `onOutput` hook, this field has the text that would otherwise be sent back to the player.

‣

### `history`

This field has an array of recent actions from the adventure.

Each action has the following fields.

- `text` - the text of the action
- `rawText` - the same as text, deprecated and included for backwards compatibility.
- `type` - the type of the action, the most common types are listed below

- `start` - the first action of an adventure
- `continue` - an action created by the AI
- `do` - a do action submitted by a player
- `say` - a say action submitted by a player
- `story` - a story action submitted by a player
- `see` - a see action submitted by a player

‣

### `storyCards`

This field has an array of story cards from the adventure.

Each story card has the following fields.

- `id` - a unique numerical id for the story card
- `keys` - keys that should cause the story card to be included in the model context
- `entry` - the text that should be included in the model context if the story card is included
- `type` - a text field that can be used to separate story cards into categories

This field was formerly named `worldInfo`. References to `worldInfo` are still valid for backwards compatibility.

‣

### `state`

This field is an object where scripts can store additional persistent information to be available across turns. Beyond being an object, this field can have any structure needed for the script.

To change the state, scripts can set values in the state object directly, without using a helper function.

In addition to creator-defined fields, the state object also expects to have the following fields.

‣

`memory`

This field is an object with the current memory for the adventure, including the following fields.

- `context` - is added to the beginning of the context, before the history. Corresponds to the Memory available in the UI.
- `authorsNote` - is added close to the end of the context, immediately before the most recent AI response. Corresponds to the Authors Note available in the UI.
- `frontMemory` - is added to the very end of the context, after the most recent player input.

Note that setting the `context` or `authorsNote` here will take precedence over the memory or authors note from the UI, but will not update them. If the `context` or `authorsNote` is not set or is set to an empty string, then the settings from the UI will still be used, so it is not possible to use the `state` to clear the memory or authors note completely.

Any updates made to the `memory` in the `onOutput` hook will not have any affect until the next player action.

‣

`message`

This field is a string which will be shown to the user. (Not yet implemented on Phoenix).

‣

`placeholders`

This field is an array of objects representing the placeholder questions and answers from the scenario start. Each object has the following fields.

- `question` - the placeholder text that appeared between `${` and `}` in the scenario (e.g. `"What is your class?"` or `"character.name"`)
- `answer` - the value the player entered for that placeholder

This array is populated once when the adventure is created and persists across turns.

Copy

```javascript
// Find a specific placeholder answer
const playerClass = state.placeholders?.find(p => p.question === 'What is your class?')?.answer

// Iterate all placeholders
for (const p of state.placeholders || []) {
  log(p.question + ': ' + p.answer)
}
```

‣

### `info`

This field is an object that can contain additional values that may sometimes be useful. These values may be different for different hooks.

- All Hooks

- `characterNames` - an array of character names for players of a multiplayer adventure
- `actionCount` - the total number of actions in the adventure

- `onModelContext`

- `maxChars` - the estimated maximum number of characters that can be included in the model context (character per token can vary)
- `memoryLength` - the number of characters included in the model context from the `memory`

‣

## Functions

Scripting API hooks have access to the following functions.

‣

### `log`

Logs information to the console.

Copy

```typescript
log("hello, world")
```

`console.log` also works to reduce confusion

`sandboxConsole.log` also works for backward compatibility, but is deprecated.

‣

### `addStoryCard`

Adds a new story card and returns the index of the new card.

If there is already an existing card with the same keys, returns false.

Copy

```typescript
const newIndex = addStoryCard(keys, entry, type)
```

`addWorldEntry` also works for backwards compatibility, but is deprecated.

‣

### `removeStoryCard`

Removes a story card.

If the card doesn’t exist, throws an error

Copy

```typescript
removeStoryCard(index)
```

`removeWorldEntry` also works for backwards compatibility, but is deprecated.

‣

### `updateStoryCard`

Updates a story card.

If the card doesn’t exist, throws an error

Copy

```typescript
updateStoryCard(index, keys, entry, type)
```

`updateWorldEntry` also works for backwards compatibility, but is deprecated.

‣

## Return

Scripting API hooks can return the following values

‣

### `text`

For the `onInput` hook, this will replace the text entered by the player.

Returning an empty string in `onInput` throws an error which is shown to the player and says `**Unable to run scenario scripts**`**.**

For the `onModelContext` hook, this will replace the text sent to the AI.

Returning an empty string in `onModelContext` causes the context to be built as though the script did not run.

For the `onOutput` hook, this will replace the text returned to the player.

Returning an empty string in `onOutput` throws an error which is shown to the player and says `**A custom script running on this scenario failed. Please try again or fix the script.**`

Copy

```typescript
return { text: 'New text' }
```

Returning the text `stop` is equivalent to returning `stop: true`.

‣

### `stop`

If `stop === true`, then the game loop will not proceed. This is useful in cases where you want a player input to update the state but to not run the AI.

When you return `stop` in the `onInput` hook, it throws an error which is shown to the player and says `**Unable to run scenario scripts**`

When you return `stop` in the `onModelContext` hook, it throws an error which is shown to the player and says `**Sorry, the AI is stumped. Edit/retry your previous action, or write something to help it along.**`

When you return `stop` in the `onOutput` hook, it changes the output to `stop`. Don’t do this.

Copy

```typescript
return { stop: true }
```

‣

## Example Scripts

If you have additional example scripts that you’d like to submit for this section, please send them to [support@aidungeon.com](mailto:support@aidungeon.com). The examples below are from the Scripting repo.

‣

### Basic Example

Copy

```typescript
const modifier = (text) => {
  
  let modifiedText = text
    
  // The text passed in is either the user's input or players output to modify.
  if(text.includes('grab a sword')) {    
      
    // You can modify the state variable to keep track of state throughout the adventure
    state.items = ['sword']
    
    // Setting state.memory.context will cause that to be used instead of the user set memory
    state.memory = {context: 'You have a sword.'}
    
    // Setting state.message will set an info message that will be displayed in the game 
    state.message = 'You got a sword!'
    
    // You can log things to the side console when testing with console.log
    console.log('Added a sword to player')
    
    modifiedText = text + '\nYou also now have a sword!'
  }
  
    // You must return an object with the text property defined. 
    return {text: modifiedText}
}

// Don't modify this part
modifier(text)
```

‣

### Don’t Be Negative

Copy

```typescript
const modifier = (text) => {
  // This will always result in a shorter string, so no need to truncate it.
  return { text: text.replace(/ not /gi, ' ') }
}

// Don't modify this part
modifier(text)
```

‣

### Notes

Copy

```typescript
// Input Modifier

const modifier = (text) => {
  state.notes = state.notes || []

  if (text.match(/> You note:/i)) {
    const note = text.replace(/> You note: ?/i, '').trim()
    state.notes.push({
      pattern: history.map(({text}) => text).join('').split("\n").pop(),
      note,
      actionCount: info.actionCount,
    })
    state.message = `Noted: ${note}`
    text = ''
  } else {
    delete state.message
  }

  return {text}
}

// Don't modify this part
modifier(text)


// Set a note by typing `note: ` when in Do mode. It will be tagged to whatever the most recent line of text is, appearing below it to the AI, but not visible to the user.

// Context Modifier

// info.memoryLength is the length of the memory section of text. text.slice(0, info.memoryLength) will be the memory.
// info.maxChars is the maximum length that text can be. The server will truncate text to this length. 
// info.actionCount is the number of actions in this adventure.

const modifier = (text) => {
  state.notes = state.notes || []

  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ''
  let context = info.memoryLength ? text.slice(info.memoryLength) : text

  // Assumes that the notes are sorted from oldest to newest.
  state.notes = state.notes.filter(({ pattern, note, actionCount }) => {
    if (actionCount > info.actionCount) {
      // The user must have hit undo, removing this note.
      return false
    }

    const index = context.indexOf(pattern)
    
    if (index >- 1) {
      context = [context.slice(0, index + pattern.length), "\n", note, context.slice(index + pattern.length)].join('')
      return true
    } else {
      // Only keep ones that were found, otherwise they must have moved out of the history window.
      return false
    }
  })

  // Make sure the new context isn't too long, or it will get truncated by the server.
  context = context.slice(-(info.maxChars - info.memoryLength))
  const finalText = [contextMemory, context].join("\n")
  return { text: finalText }
}

// Don't modify this part
modifier(text)
```

‣

### Reimplement Authors Note

Copy

```typescript
// info.memoryLength is the length of the memory section of text.
// info.maxChars is the maximum length that text can be. The server will truncate the text you return to this length.

// This modifier re-implements Author's Note as an example.
const modifier = (text) => {
  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ''
  const context = info.memoryLength ? text.slice(info.memoryLength) : text
  const lines = context.split("\n")
  if (lines.length > 2) {
    const authorsNote = "Everyone in this story is an AI programmer."
    lines.splice(-3, 0, `[Author's note: ${authorsNote}]`)
  }
  // Make sure the new context isn't too long, or it will get truncated by the server.
  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength))
  const finalText = [contextMemory, combinedLines].join("")
  return { text: finalText }
}

// Don't modify this part
modifier(text)
```

‣

### Command Parser

Copy

```typescript
// This is an example Input Modifier that looks for commands from the user.

const modifier = (text) => {
  let stop = false

  // This matches when the user types in ":something arg1 arg2" in any of the three input formats. For example, they could
  // type ":status" and then command would be "status" and args would be [], or they could type ":walk north" and command
  // would be "walk" and args would be ["north"].
  const commandMatcher = text.match(/\n? ?(?:> You |> You say "|):(\w+?)( [\w ]+)?[".]?\n?$/i)
  if (commandMatcher) {
    const command = commandMatcher[1]
    const args = commandMatcher[2] ? commandMatcher[2].trim().split(' ') : []
    state.message = `Got command '${command}' with args ${JSON.stringify(args)}`
    stop = true
    text = null
  } else {
    delete state.message
  }

  // You must return an object with the text property defined.
  // If you include { stop: true } when inside of an input modifier, processing will be stopped and nothing will be
  // sent to the AI.
  return { text, stop }
}

// Don't modify this part
modifier(text)
```

‣

### Death Island

Copy

```typescript
const modifier = (text) => {
  let modifiedText = text
  
  if(!state.events){
    state.turn = 0
    state.events = [
    'You hear a rustling in the bushes near you. Suddenly',
    'An ear splitting scream suddenly echoes',
    'You feel a cold chill go up your spine. You look up and see',
    'You suddenly get hit by',
    'Before you can do that you hear a loud crash. You look towards the sound and see a dark demonic looking creature',
    'You discover a horrifying',
    'You hear a terrifying sound',
    'You wake up and realize you were dreaming. You look down and see that your arms are in shackles',
    'A hand grabs your leg and you trip hitting your head on a stone. You wake up in a cage',
    'An uneasy feeling begins to settle in your stomach as',
    'You remember a dark feeling from last night',
    'Suddenly a bloody head rolls toward you from out of the bushes',
    'You see a massive creature',
    'A band of cannibals',
    'You see a band of cannibals',
    'A dark creature',
    'You feel a sharp pain in your side and realize'
    ]
  }
  else{
    modifiedText = "\n> You try to " + text.substring(7)
  }
  
  state.turn = state.turn + 1
  
  if(state.turn > 2){
  state.memory = {context:  "You're probably going to die."}
  }
  if(state.turn > 6){
    state.memory = {context: "You're about to die."}
  }
  else if(state.turn > 10){
    state.memory = {context: "You have no hope. There are minutes left till you die."}
  }

  const nTurn = Math.floor((Math.random() * 2)) + 3

  if(state.turn % nTurn === 0){
    const eventInd = Math.floor((Math.random() * state.events.length));
      if(eventInd < state.events.length){
        modifiedText = modifiedText + '\n' + state.events[eventInd]
        state.events.splice(eventInd)
      }
  }
  
    
    // You must return an object with the text property defined. 
  return {text: modifiedText}
}

// Don't modify this part
modifier(text)
```

‣

### Guess or Die

Copy

```typescript
// Input Modifier
const modifier = (text) => {
  if(!state.initialized) {
    state.initialized = true;
    state.randomNumber = Math.round(Math.random()*9999+1);
    state.remainingGuesses = 13;
  }
    
  var match = text.match(/(\d+)/)
  if(match && match[1]) {
    state.remainingGuesses--;
    var number = parseInt(match[1]);

    var output = "\nYou have "+state.remainingGuesses+" guesses remaining.  ";

    if(number == state.randomNumber) {
      output += "\nYou guessed the number!  Congratulations, you win!";
    } else if (state.remainingGuesses <= 0) {
      output += "\nYou ran out of guesses!  You are dead.  You lose!";
    } else if (number > state.randomNumber) {
      output += "\nYour guess is too high!";
    } else if (number < state.randomNumber) {
      output += "\nYour guess is too low!";
    }
    state.nextOutput = output;
    return {text}
  }
  state.nextOutput = "\nPlease enter a number!";
  return {text};
}

modifier(text)

// Output Modifer
const modifier = (text) => {
  return {text: state.nextOutput ? state.nextOutput : ""};
}

modifier(text)
```

‣

### Magic

Copy

```typescript
// Here's a fun scripting example where players have to learn these magic spells to have cool effects.
// The world info has entries that should hopefully lead people to these spells and so that they can find and cast them.
// Can find the scenario at https://play.aidungeon.com/scenario/ANK4YlUw3xYx/legends-of-magic
// I changed the spell names so it doesn't ruin the discovery if you play the adventure.

const modifier = (text) => {
  
  let modifiedText = text
  state.message = ''
  
  if(!state.spells){
    state.spells = []
  }
  
  const spells = {
    'SPELL1': 'a deathly fire ball spell that',
    'SPELL2': 'turning yourself into a cloud allowing you to move at will',
    'SPELL3': 'a dark spell that summons an evil demon. You hear a dark rumbling and see a cloud of black smoke appear. Out of it appears a large horned demon'
  }
  
  const lowered = text.toLowerCase()
 for(spellName in spells){
    if(lowered.includes('cast ' + spellName.toLowerCase())){
      if(!state.spells.includes(spellName)){
        state.spells.push(spellName)
        state.message = "Congrats you've learned the " + spellName + " spell!"
      }
      modifiedText = text + '\n' + 'You cast ' + spellName + ', ' + spells[spellName]
    }
  }
    
    return {text: modifiedText}
}

modifier(text)
```

‣

### Sundale

Copy

```typescript
// An example of how scripting can be used to manipulate quests, as well as how messages and the state variable can be used to store and show information
// The code can be given basic changes using the state.configuration object, without needing to deal with the rest of the code
// The scenario this was made for can be seen at https://play.aidungeon.com/scenario/80sASRH07Lwk/sundale

// INPUT MODIFIER

const modifier = (text) => {
    state.configuration = {
        enableSelectionOnCompletedQuest: false, // Whether quest selection should be restricted until a specific quest is completed
        enableSelectionOnQuest: 0, // The line number of the quest in the list of quests (e.g. quest on second line = 2) on the Edit Scenario page. Only used when the above is true.
        initialQuests: 0, // The amount of quests inputted into the Edit Scenario page
        quests: [ // The quests that will become available to the player either after the above quest is completed or at the start of the scenario.
            {
                name: "quit your job", // The quest's name, shown in the selection message
                objectives: ["resign from your job"], // The objectives that are part of the quest
                nextQuests: [ // The quests that should be assigned after the player completes this one
                    {
                        name: "find a new job",
                        objectives: ["get a job"],
                        nextQuests: []
                    }
                ]
            }
        ]
    }

    if (state.initialised != true) {
        state.finishedScenario = false
        state.initialised = true
        if (!state.configuration.enableSelectionOnCompletedQuest) {
            state.availableQuests = JSON.parse(JSON.stringify(state.configuration.quests))
        } else {
            state.availableQuests = []
        }
        state.assignedQuest = ""
        state.nextOutput = ""
    }

    state.nextOutput = ""

    if (text.toLowerCase().startsWith("\n> you take up quest ")) {
        state.assignedQuest = JSON.parse(JSON.stringify(state.availableQuests[text.toLowerCase().substring(21) - 1]))
        quests.push({
            quest: state.assignedQuest.objectives.shift()
        })
        state.nextOutput = "You decide that the next thing you want to do with your life is " + state.assignedQuest.name.toLowerCase() + "."
    } else if (text.toLowerCase().includes("\n> you give up on your quest.")) {
        state.nextOutput = "You give up on your quest to " + state.assignedQuest.name.toLowerCase() + "."
        state.assignedQuest = ""
        quests.splice(state.configuration.initialQuests)
    }

    return {
        text: text
    }
}

modifier(text)


// OUTPUT MODIFIER

const modifier = (text) => {

    let modifiedText = text

    if (!state.finishedScenario || !state.configuration.enableSelectionOnCompletedQuest) state.message = ""

    if ((state.finishedScenario || !state.configuration.enableSelectionOnCompletedQuest) && state.assignedQuest == "") {
        questNames = []
        for (quest of state.availableQuests) {
            questNames.push(quest.name)
        }
        state.message = "Available Quests: " + questNames.join(", ") + ". To take up a quest, type 'take up quest <quest number in list>'."
    } else if (state.assignedQuest != "") {
        if (!quests[state.configuration.initialQuests].completed) {
            state.message = "Current Objective: " + quests[state.configuration.initialQuests].quest + ". To quit, type 'give up on my quest'."
        } else {
            nextObjective = state.assignedQuest.objectives.shift()
            if (nextObjective == undefined) {
                quests.splice(state.configuration.initialQuests)
                state.availableQuests = state.availableQuests.filter(e => e.name !== state.assignedQuest.name)
                for (nextQuest of state.assignedQuest.nextQuests) {
                    state.availableQuests.push(nextQuest)
                }
                state.assignedQuest = ""
                questNames = []
                for (quest of state.availableQuests) {
                    questNames.push(quest.name)
                }
                state.message = "Available Quests: " + questNames.join(", ") + ". To take up a quest, type 'take up quest <quest number in list>'."
            } else {
                quests.splice(state.configuration.initialQuests)
                quests.push({
                    quest: nextObjective
                })
                state.message = "Objective completed! New objective: " + quests[state.configuration.initialQuests].quest + ". To quit, type 'give up on my quest'."
            }
        }
    }

    if (state.configuration.enableSelectionOnCompletedQuest) {
        if (quests[state.configuration.enableSelectionOnQuest - 1].completed == true && !state.finishedScenario) {
            state.message = "Quests have been assigned and will be accessible next turn."
            state.finishedScenario = true
            state.availableQuests = JSON.parse(JSON.stringify(state.configuration.quests))
        }
    }


    if (state.nextOutput !== "") {
        return {
            text: state.nextOutput
        }
    }

    return {
        text: modifiedText
    };
}

modifier(text)
```

‣

## Known Issues

‣

## Reporting Issues

To report an issue with Scripting in AI Dungeon, please post to the [bugs-feature-request channel on Discord](https://discord.gg/RcYntV44fF).

In addition, if you can create and publish a Scenario with a minimal reproduction case showing the issue and include that published link in your bug report, that would significantly increase how quickly we can resolve the problem.
