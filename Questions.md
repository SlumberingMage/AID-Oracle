# QUESTIONS

I did the questions nested under each parameter they are contained in. If anything is off or hard to interpret, please let me know!

Also, I looked in the modules section to get more info on things, but I wanted to ask you about basically any value or parameter that I had an ounce of question about. So if it seems long, I just wanted to be thorough!

## LINE BY LINE QUESTIONS

`defaultAction`

- What is the `defaultAction`? Not the value; I mean **literally**, what is the action?
A: It is a non named skill action.
- Why do you need a "*default*" action?
A: For anytime a none skill is used, think of it like 'luck'.

- `note`
  - Is this reflected in the AN on the UI?
A: This sent to the 'Author Notes'

- `rate`
  - This is the *"rule"* for the probability, correct? Yes.
  - For example, the default example is `rate: defaultActionRate.starting (.3) + defaultActionRate.MaxBonusRate (.2)` meaning the rate would STAY at .5, (50%) correct? Yes.
  - If you want the rate change to be dynamic, do you have a recommended equation?
  A:I would keep it low, like '0.05', the default skill is a catch-all.
    - For example, for the `starting` value, I see that you recommend .5 for easy and .2 for hard. Anything similar here?

Still under `defaultAction`:

`leveling`
- `rateOfChange`: *How much the action rate changes per leveling event.*
      - What is a leveling event? How does it occur? A leveling event occurs from a successful use of the skill, a failed use of the skill, or any other action that does not use the skill.
        - As in, what TRIGGERS an increase or decrease?
          - Is it success, failure, being idle, etc.?
      - Similar to above, HOW does this value become active?
      - What are the possible values? 0 - 100? Any number less than '1.0' 1 represents 100%
      - What do those values represent? (Does 100 = 100%)
  - `rateOfChangeFailureMultiplier`: *The rate of change multiplier for failure.*
    - So this value is basically a way to specify the failure aspect of the probability? No, it's how much the skill goes down from a failed action.
    - Are you saying that you can make the probability of failures specific? No.
    - What are the possible values? 0 - 100? Any whole number.
    - What do those values represent? (Does 10 = 10 times the `rateOfChange` value?) Yes.
  - `decreaseRate`:
    - This is basically how much the probability decreases PURELY because of inactivity, not failure, correct? Yes.
    - Using the `CharismaAction` example, `decreaseRate`: 0.001 / 6. So, is this value:
      - An actual fraction OR? Yes.
      - Is it the decimal (fraction) / the number of turns? I used fractions because they represent percentages. 0.01 is 1% and 1.0 is 100%.

Still under `defaultAction`:

`coolDown`
- `decreaseRatePerAction`
    - What are the possible values? 0 - 100? Any whole number, it is the number of actions needed to drop the cooldown rate.
    - What do those values represent? (Does 1 = 1 turn?) Yes.
- `failureThreshold`
    - Is this basically once the user hits this number of failures, THEN the action goes on cooldown? Yes.
- `failureCount`, `remainingTurns`:
    - These don't really need to be adjusted, correct? As in, the system will automatically calculate during gameplay and change the values accordingly? Yes.
    - Is `failureThreshold` = `remainingTurns` when activated? `failureThreshold` is the number of back to back turns it takes to put a skill on cooldown. `remainingTurns` is how many turns remain keeping the skill on cooldown.
      - For example, if the `failureThreshold` is 5 and I reach it, will the `remainingTurns` value automatically go to 5? Yes.
- `memorable`:
    - Is this displayed somewhere? I believe it ends up in the author's notes and displays the `knownFor` from the skill. If you fight a lot you end up being known for violence.
    - Specifically, why does this matter? Is this just flavor, or does this impact gameplay? (Such as a boost to action success probability) It is meant to change how people interact with you.
- `memorableThreshold`
    - What does this value represent?
      - For example, is this how many times you need to SUCCESSFULLY complete an action? This is very vague. Yes.
    - Can the number of actions decrease at some point? Or is it static? (Once I hit 3, let's say, am I ALWAYS memorable?) No, its tied to `actionHistory`. If you have more than 3 of that action in the action history then you trigger `knownFor`
      - If it can decrease or reset, does `actionHistorySize` control this? Partially, yes.
      - If it doesn't, how would it know I hit 3 of a given action if the `actionHistorySize` no longer lists those actions? Is it basically like a permanent checkmark? No, it's temporary, unless you use a skill a lot.


`defaultPlayerYou`
  - `status`
    - Does this appear as a message? No it shows up in AN.
    - Why does this matter? What does this do? Is this just flavor, or does this impact gameplay? (Such as a boost to action success probability) it affects the AI's writing.
  - `actionHistorySize`
    - I have a feeling this affects a LOT of values; my overall question is does this RESET or DECREASE certain values once the size is crossed? It's only used for triggering `knowFor`
      - Basically, are only the ACTIONS IN THE `actionHistory` ARRAY counted for the number actions that affect most things? Like, once you get past this, the action is "forgotten" basically? Yes.
  - `actions`
      - In the example, the value `defaultActions()` is listed here. 
        - Does this value HAVE to remain here? Yes, unless you want to create a custom set of actions.
        - Do ALL the actions I want the player to be able to perform need to go here, or only the "default" ones? Yes, unless you enable the dynamic action system.
        - If NO and not all actions go there, do you make a different value each time?
          - For example, would charisma actions be something like `defaultCharismaActions()`?
  - `actionHistory`
    - See screenshot 2: 
      - Is the `actionCount` always 1 for a given action? Yes.
        - For example, if I did the default action 4 times, would it be four separate lines of that same action, or would the `actionCount` increase to 4
      - Why would the same actions be split into different lines? So they roll off action history.
  - `exhaustion`:
    - What does this mean? That once this threshold is hit, the plater can no longer perform actions?
    - What resets this value? Is it `actionHistorySize`?
    - `inactive`, `active`
      - Define `active`;
        - What makes a turn "active"? Is it doing any `action`?
        - How is this shown in the UI?
      - Why do these matter?
      - What resets or changes these values? Is it `actionHistorySize`?
          - For example, if the size is set to 10, and I have 7 active turns and 3 inactive. The next turn, I am active and the active turn number goes up to 8. Is the inactive turn number at 2 now? 
      - If possible, does one value reset once the other activates? 
          - For example, if I do 5 active turns in a row, then 2 inactive, is the `active` value still at 2?
      - `threshold` 
        - What determines if the threshold value is met? Active turns? 
  - `threat`:
    - Basically same questions as above.
  - `eventSystem`
    - I put the questions for this under the `defaultGame` section to avoid repetition.


Still under `defaultPlayerYou`:

  - `resources`
    - `isIncreased`: "Is the resource increasing or decreasing naturally over time?"
      - Since the value is true or false, how would you indicate a decrease? Would you have to change the `rate` to a negative number?
    - `isCritical`
      - Is this just so the `thresholds` array can be triggered?
      - Only flavor, or can this impact gameplay?
        - For example, if you run out of the `resource` "health", can you make it so that the game tells that you die? The it ends? Or more just a tacking system?
    - `isConsumable`
      - Confused; define "consumable". Do you mean the resource can be consumed **AT WILL** or do you mean it is **able to be changed**?
  
      - These are more in-depth general AND specific questions about how resources influence things:
        - Are resources mainly just **flavor**? Or do they have a gameplay effect?
        - For example, let's look at if I added a "health" resource for my character. Let's say I am fighting a monster and it hits me. I lose 4 health points:
          - Is the AI going to "know" that I lost health?
          - Would it know that "0" meant I was dead? 
          - Can the AI actually impact the health value? 
            - If no, do I need to tell it somehow?
            - If no, do **I** need to track health?
          - Do **I** get the "slightly injured" message? Or is that something letting the AI know I am hurt?
            - Is that a message that SHOULD go to the UI, but the bug is preventing it from working?
          - Can health be assigned to NPCs? This would probably be from the `defaultGame` `EventSystem`?

- `defaultGame`
  - `dynamicActions`
    - Define?
    - How would I add a dynamic action? Use new wording? If you use a fireball skill, but it does not preexist then it's added to your skills.
    - If added, does the system basically construct a new object in the `customActions` array? Yes.
  - `enableReputationSystem`
    - What is this? How does the player impact this? It determines if `knowFor` is triggered and added to AN.
    - Don't see many values, so is this flavor or gameplay?
  - `enableSayCharismaCheck`
    - Just double-checking, basically has to be on for Charisma to work, right? Yes.
  - `eventSystem`
    - Are events basically just flavor? For example, if it is foggy, does this get added to the AN? Yes.
    - I am not understanding how to show cyclic events here (like time of day). Can you copy and modify the code block at the end? It's tied to player actions with a random chance of changing.
  - `eventSystemEnabled`
      - This value is not under the player `eventSystem`.
      - Does it need to be? No.
      - Or does enabling this do it for all players AND the game? Yes.
  - `authorsNote`
    - Do these showup in the actual author's notes? It should.
      - If yes, can this help save token space? It uses token space.
      - If no, do these impact the AI? It should change how the AI writes the story.
  - `enablePlayerMessage`
    -  Just curious, are these meant to be game messages from Oracle? Or player messages to other players?
    - I'm assuming `messages` would be where the messages go?
  A: this should show up at the top of the screen where you get some of the messages from AID when playing. That function in AID was broken, and so this is disabled by default. When I wrote the script originally, if you popped a message up on the screen, it would simply stay there and not go away they would stack up.


## CODE BLOCK FOR SEQUENTIAL/CYCLIC EVENTS

eventSystem: [
    {
        name: "Natural Weather",
        events: [
            { chance: 1, description: "It is clear outside." },
            { chance: .25, description: "There is a thick fog outside." },
            { chance: .15, description: "There are clouds outside." },
            { chance: .1, description: "There are clouds and precipitation outside." },
            { chance: .05, description: "It is thundering outside." },
        ],
        // The chance of the event system changing events.
        chance: 0.1,
        // The current event within the event system.
        current: { chance: .05, description: "It is thundering outside." },
        // the description of the current event.
        description: "It is thundering outside.",
        // Indicates whether the event is random.
        isRandom: true
    },
],
