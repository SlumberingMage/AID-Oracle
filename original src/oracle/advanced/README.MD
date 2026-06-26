This game engine Oracle that adds depth and complexity to AI Dungeon. Here are the key features:

- Action System: The code defines a system for managing different types of actions that the player can take, such as fighting, movement, observation, and performance. Each action has properties like success/failure rates, leveling mechanics, cooldown mechanics, and memorable thresholds.
- Player Management: The code allows for multiple players, each with their own set of actions, resources (e.g., health), exhaustion levels, and event systems. Players can be dynamically added or configured.
- Event System: The game features event systems that can trigger random events at the game level or player level. These events can be cyclic (sequential) or random, and they can represent things like weather, time of day, or changes in the player's state.
- Resource Management: The code includes a system for managing resources, such as health, with configurable thresholds and messages based on the resource levels.
- Reputation System: The code tracks memorable actions taken by players, building a reputation for each player based on their actions.
- Cooldown System: Actions can have cooldown periods after failure or success, temporarily preventing the player from using those actions.
- Threat System: The code includes a threat system that can trigger events or outcomes based on the player's inactivity or lack of action.
- Exhaustion System: Players can become exhausted after taking too many actions, affecting their performance.
- Charisma System: The code includes a specialized "charisma" action for handling speech or dialogue interactions, with its own set of mechanics.
- Customization: The code allows for extensive customization of actions, events, resources, and other game mechanics through configuration objects and arrays.
- Module Processing: The code includes a system for processing different game modules (e.g., updating resources, handling cooldowns) in a specific order, allowing for extensibility and modular design.
