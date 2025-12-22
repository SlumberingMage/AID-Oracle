# Oracle

A game engine for AI Dungeon.

- [Download](https://raw.githubusercontent.com/SlumberingMage/AID-Oracle/main/distribution/output.js) Output Fix.
- [Download](https://raw.githubusercontent.com/SlumberingMage/AID-Oracle/main/distribution/oracle-lite-1.1-input.js) Light.
- [Download](https://raw.githubusercontent.com/SlumberingMage/AID-Oracle/main/distribution/oracle-3.2-input.js) Full.

## Output Paragraph Fix

- [Download](https://raw.githubusercontent.com/SlumberingMage/AID-Oracle/main/distribution/output-format-paragraph.js) Output Fix.

### Command Structure for Skills

'> {Player} {try|tries|attempt|attempts} to use {action}.'

I.E.
'> You try to use fighting to defend yourself.'
'> You try to use first aid to heal yourself.'
'> Bob tries to use scavenging to find resources.'
'> Alice tries to move the rock.'

### Command Structure for Charisma

'> {Player} {try|tries|attempt|attempts} to use {say|says}.'

I.E.
'> You try to say, "Can I get a discount?'

Action System: Oracle v3 comes equipped with predefined actions such as speaking, fighting, scavenging, stealth, resistance (a mutant power), and first aid. Each action includes success rates, specific phrases for success and failure, and a cooldown mechanism.

Dynamic Action Rates: The success rates of actions can adjust dynamically based on previous outcomes. This includes modifications for success rates, cooldown periods, and thresholds for failures.
Exhaustion System: The game tracks the player's level of exhaustion, which is influenced by the number of active and inactive turns. Excessive activity or inactivity leads to exhaustion, affecting the player's status in the game.

Threat System: This system monitors the player’s activity and generates random threats when activity levels drop below a certain threshold, enhancing the game's sense of danger.
Status and Cooldown Tracking: Oracle v3 maintains a log of the player's current status and any actions that are on cooldown, including the number of turns until they become available again.

Customization: Nearly all aspects of the system are customizable. Users can enable or disable various modules and tailor the unified Action System to create, modify, or replace actions as desired.