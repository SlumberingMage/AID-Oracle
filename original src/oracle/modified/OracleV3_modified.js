// Every script needs a modifier function
const modifier = (text) => {
    const oracle = (state, text, history, storyCards, info) => {
        // Helper functions
        const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];


        const getNextItem = (arr, currentIndex) => {
            if (!arr.length) {
                throw new Error('Array cannot be empty.');
            }
            // Ensure the currentIndex is within the array bounds
            currentIndex = currentIndex % arr.length;
            return arr[(currentIndex + 1) % arr.length];
        }

        /**
         * Accounts for both an upper and lower bound
         *
         * @param {*} number number to check
         * @param {*} lowerBound
         * @param {*} upperBound 
         * @returns Adjusted number
         *  ----------------------------------
         * Accounts only for the lower bound
         * @param {*} number number to check
         * @param {*} lowerBound required
         * @returns Adjusted number
         */
        const checkWithinBounds = (number, lowerBound, upperBound) => {
            
            //Checks for lower bound
            if (upperBound === undefined) {
                if (number > lowerBound) {
                    return number;
                }
                else {
                    return lowerBound;
                }
            }
            //Checks both upper and lower bounds
            else {
                if (number > upperBound) {
                    number = upperBound;
                    return number;
                }
                else if (number > lowerBound) {
                    return number;
                }
                else {
                    return lowerBound;
                }
            }
        }


        

        /**
         * The starting action rates.
         * @param {number} starting The minimum value for an action.
         * @param {number} MaxBonusRate The max starting bonus rate.
         * @param {number} MinBonusRate The min starting bonus rate.
         */
        class ActionRate {
            constructor(starting, MaxBonusRate, MinBonusRate) {
                this.starting = starting;
                this.MaxBonusRate = MaxBonusRate;
                this.MinBonusRate = MinBonusRate;
            }
        }

        const defaultActionRate = () => {
            return state.game.actionRate.starting + (Math.random() * (state.game.actionRate.MinBonusRate - state.game.actionRate.MaxBonusRate) + state.game.actionRate.MaxBonusRate)
        }

        class ActionHistory {
            constructor(name, actionCount) {
                this.name = name;
                this.actionCount = actionCount;
            }
        }

        class Action {
            constructor(
                name = [],
                successEndings = ["masterful", "remarkable", "flawless"],
                failureEndings = ["could not succeed", "failed spectacularly", "was pitiful"],
                successStart = "Your action is",
                failureStart = "Despite your efforts, your action",
                coolDownPhrase = "You are unable to!",
                memorable = .5,
                knownFor = "",
                memorableThreshold = 10,
                rate = defaultActionRate(),
                note = "") {
                this.name = name.map(n => n.toLowerCase());
                this.successEndings = successEndings;
                this.failureEndings = failureEndings;
                this.successStart = successStart;
                this.failureStart = failureStart;
                this.note = note;
                this.rate = rate;
                this.memorable = memorable;
                this.knownFor = knownFor;
                this.memorableThreshold = memorableThreshold;
                this.preventActionFlags = [];
            }
        }





         /**
         * Represents a player in the game.
         * @class
         */
        class Player {
            /**
             * Represents a constructor for the Player class.
             * @constructor
             * @param {string} name - The name of the Player.
             * @param {string} status - The status of the Player.
             * @param {Array} actions - The actions of the Player.
             * @param {Array} actionHistory - The action history of the Player.
             */
            constructor(
                name,
                actions,
            ) {
                this.name = name;
                this.status = status;
                this.actions = actions;
                this.actionHistory = actionHistory;

            }
        }



        class Game {
            constructor(
                playerActivity, 
                dynamicActions, 
                enableReputationSystem, 
                enableSayCharismaCheck, 
                enableSayCharismaCheck, 
                eventSystem, eventSystemEnabled, 
                enableSayCharismaCheck,
                eventSystem, eventSystemEnabled, 
                authorsNote, 
                actionRate, 
                enablePlayerMessage, 
                messages
            ) {
                this.playerActivity = playerActivity;
                this.dynamicActions = dynamicActions;
                this.enableReputationSystem = enableReputationSystem;
                this.enableSayCharismaCheck = enableSayCharismaCheck;
                this.eventSystem = eventSystem;
                this.eventSystemEnabled = eventSystemEnabled;
                this.authorsNote = authorsNote;
                this.actionRate = actionRate;
                this.enablePlayerMessage = enablePlayerMessage;
                this.messages = messages;
                this.players = {};

            }

            
        }

        /**
        * Returns a player given a name. If no such player exists, a new player is created
        * @param {string} playerName 
        * @returns 
        */
       const getPlayer = (playerName) => {
           //If player is new, add them to the playerlist
           let player = this.players[playerName];
           if (!player) {
               state.game.players.assign(new Player(playerName, ACTIONS));
           }
           if (!returnPlayer) {
               return player;
           }
       }

        const delphicBase = (state, text, history, storyCards, info) => {
            const GAME = new Game(
                new PlayerActivity(
                    new Exhaustion(
                        true, // Enables the exhaustion system
                        5, // Player exhaustion status threshold
                        0, // Starting value for for inactive turns counter
                        0, // Starting value for for active turns counter
                        "You are exhausted!" // The message to display when the exhaustion threshold
                    ),
                    new Threat(
                        false, // Enabled the player activity threat system
                        3, // The threshold to drop below before activating
                        3, // The current count of active turns
                        3, // The current count of inactive turns,
                        [
                            "You can barely hear something.",
                            "You saw something on the edge of your vision.",
                            "You smell something but cannot make it out."
                        ]
                    )
                ),
                false, // Enable subsystem to allow dynamically added skills during game play.
                true, // Enable reputation from action use.
                true, // Enable say to charisma check sub system.
                "Style Keywords: Light, breezy, punchy, whimsical. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual.", // The default authors note for the setting.
                new ActionRate(
                    .4, // The base starting rate for actions
                    .2, // The maximum starting bonus
                    .01, // The minimum starting bonus
                ),
                true, //Player message toggle
                [], // Start the messages array blank.
            );

            //Initialize game at start of scenario
            if (!state.game) {
                state.game = GAME;
            }

            
            // Ensure state.memory.authorsNote is blank and ready.
            if (!state.memory.authorsNote) {
                state.memory.authorsNote = "";
            }
            // Ensure state.message is blank and ready.
            state.message = "";
        }
        delphicBase(state, text, history, storyCards, info);


        //Set default Actions
        const ACTIONS = [
            new Action(
                ["default"],
                ["masterful", "remarkable", "flawless"],
                ["could not succeed", "failed spectacularly", "was pitiful"],
                "Your action is",
                "Despite your efforts, your action",
                "You are unable to!",
                .5,
                "Your known to be bland, boring and run of the mill.",
                10,
                state.game.actionRate.starting + state.game.actionRate.MaxBonusRate,
                {
                    // Allow action increase?
                    increaseEnabled: false,
                    // Allow action decrease?
                    decreaseEnabled: false,
                    // The actions maximum rate
                    maxRate: state.game.actionRate.starting + state.game.actionRate.MaxBonusRate,
                    // The actions minimum rate
                    minRate: state.game.actionRate.starting + state.game.actionRate.MaxBonusRate,
                    // The base rate of action change
                    rateOfChange: 0,
                    // The experience failure multiplier
                    rateOfChangeFailureMultiplier: 1,
                    // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
                    decreaseRate: 0
                },
                {
                    // Enables the action cool down system
                    enabled: false,
                    // How quick the cool down rate goes down per player turn
                    decreaseRatePerAction: 1,
                    // The failure threshold for when to cool down actions
                    failureThreshold: 3,
                    // The current count
                    failureCount: 0,
                    // The remaining Cool down turns
                    remainingTurns: 0
                }
                
            ),
            new Action(// Do not remove. Removing charisma will break the script
                ["charisma", "speech", "diplomacy", "words", "speak", "converse", "influence", "charm", "convene", "convince", "coax", "reason", "persuade", "persuasion", "encourage", "encouragement", "win over", "assure", "reassure", "reassurance", "comfort", "intimidate"],
                ["persuasive", "charming", "convincing"],
                ["awkward", "unconvincing", "ineffectual"],
                "You speak with",
                "You try to be persuasive, but your words are",
                "You're too flustered to speak clearly!",
                .5,
                "The room seems to light up when you enter.",
                10
            ),// START action change section.
            new Action(
                ["fighting", "combat", "weapon", "hit", "strike", "attack", "counter", "counterattack", "assault", "ambush"],
                ["brutal efficiency", "deadly precision", "unyielding resolve"],
                ["misjudged", "ineffective", "reckless"],
                "You attack with",
                "Your attack proves",
                "You could die!",
                .9,
                "People fear you and your aura of violence.",
                8
            ),
            new Action(
                ["movement", "move", "running", "jumping", "dodge", "agility", "muscle memory", "leap", "leaping", "sneak", "stealth", "climb", "climbing", "parry", "escape", "free yourself", "maneuver", "duck"],
                ["agile", "graceful", "fluid"],
                ["clumsy", "reckless", "awkward"],
                "Your movement is",
                "Your attempt to move was",
                "You can't move anymore!",
                .2,
                "You move with grace and style.",
                15
            ),
            new Action(
                ["observe", "look", "watch", "inspect", "investigate", "examine", "listening", "hearing", "smell", "intuition", "analyze", "analysis", "deduce", "deduction", "decode", "assess", "sniff", "scent"],
                ["perceptive", "attentive", "detailed"],
                ["many are overlooked", "you get distracted", "you don't find many"],
                "You observation is careful and",
                "Despite your efforts to notice details,",
                "Your focus breaks and you miss crucial details!",
                .3,
                "Your eyes are always watching.",
                10
            ),
            new Action(
                ["performance", "dancing", "singing", "jokes"],
                ["perceptive", "engaging", "lively"],
                ["overlooked", "distracted", "bland"],
                "Your preform performance is ",
                "Despite your efforts, you are",
                "Your focus breaks and your performance falls flat.",
                .8,
                "You bring smiles to peoples faces.",
                10
            ),
            // End action change section.
        ];

        




        state.game.moduleProcessing = [];

        if (!state.game.playerTemplate) {
            state.game.playerTemplate = new Player("Template!", ACTIONS);
        }
        
//////// Begin module addition section /////////////////////////////////////////////////////////////



/**TO DO:
Remove all references to either leveling or cooldown save for their respective dedicated processing functions
Add logic for initializing:
        cooldown
        threat
        events
        exhaustion
        reputation
 
 


Each module should have:
        A toggle
        Class definitions to be appended to either (state.game) or (state.game.players)
        Necessary helper functions (if needed)
        A single function to be called on player input

Idea of logic flow:
 
    Initialize a barebones game state with an empty player list
    Create a template player object to be used during initialization of modules
    Player template should have all predefined actions
        ACTIONS array can contain things from modules, it wont break logic (I think)
    Per module:
        Check if enabled, if yes:
        Append neccessary variables/flags to the player template or game object
    
 
 
               this.exhaustion = exhaustion;
                this.isExhaustionEnabled = isExhaustionEnabled;
                this.threats = threats;
                this.isThreatEnabled = isThreatEnabled;
                this.resources = resources;
                this.isResourceEnabled = isResourceEnabled;

 
 */



//////// Leveling Module //////////////////////////////////////////////////////////////////////////

        
        
        /**
         * The leveling information for an action.
         * @param {boolean} increaseEnabled Allow action increase
         * @param {boolean} decreaseEnabled Allow action decrease
         * @param {number} maxRate The actions maximum rate
         * @param {number} minRate The actions minimum rate
         * @param {number} rateOfChange Starting value for success rate change per use of action
         * @param {number} rateOfChangeFailureMultiplier A multiplier to apply to rateOfChange when an action fails
         * @param {number} decreaseRate How fast you lose your success rate when action is not used. I recommend it be the success experience divided by less than the number of actions
         */
        class Leveling {
            constructor(
                increaseEnabled,
                decreaseEnabled,
                maxRate,
                minRate,
                rateOfChange,
                rateOfChangeFailureMultiplier,
                decreaseRate,
            ) {
                this.increaseEnabled = increaseEnabled;
                this.decreaseEnabled = decreaseEnabled;
                this.maxRate = maxRate;
                this.minRate = minRate;
                this.rateOfChange = rateOfChange;
                this.rateOfChangeFailureMultiplier = rateOfChangeFailureMultiplier;
                this.decreaseRate = decreaseRate;
            }
        }

        
        /**
         * Logic for action leveling
         * @param {*} action Name of the action being processed
         * @param {boolean} isSuccess Boolean denoting whether the action was successful or not
         */
        const processActionLeveling = (activeAction, isSuccess) => {
        
            //Active action
                
            // Increase the action rate more significantly the lower the current action level is.
            const newRate = activeAction.leveling.rateOfChange;
            newRate *= (isSuccess ? 1 : activeAction.leveling.rateOfChangeFailureMultiplier);
            newRate /= activeAction.leveling.maxRate;
            newRate += 1;
            newRate *= activeAction.rate;


            //On action success
            if (isSuccess) {
                state.player.actions.forEach(a => a.coolDown.failCount = 0);
                if (action.leveling.increaseEnabled) {
                    activeAction.rate = checkWithinBounds(newRate, activeAction.leveling.minRate, activeAction.leveling.maxRate);
                }
            }
            //On action failure
            else {
                activeAction.rate = checkWithinBounds(newRate, activeAction.leveling.minRate, activeAction.leveling.maxRate);
            }
    
            //Inactive actions
                state.player.actions.forEach(action => {
                    if (action.name !== activeAction.name) {
                        //Decreases skill in actions you don't use
                        if (action.leveling.decreaseEnabled) {
                            checkWithinBounds(action.rate - action.leveling.decreaseRate, action.leveling.minRate, action.leveling.maxRate);
                        }
                    }
                });
        }

        const defaultActionLeveling = () => { new Leveling(
            {
                // Allow action increase?
                increaseEnabled: true, // Default action increase
                // Allow action decrease?
                decreaseEnabled: true, // Default action decrease
                // The actions maximum rate
                maxRate: 0.95,
                // The actions minimum rate
                minRate: 0.3,
                // The base rate of action change
                rateOfChange: 0.001,
                // The experience failure multiplier
                rateOfChangeFailureMultiplier: 10,
                // The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
                decreaseRate: 0.001 / 6
            })}

        if (true) { //<<<<<<<<<      TOGGLE ACTION LEVELING: (true) to turn on. (false) to turn off      <<<<<<<<<//


            //Get action leveling into all non-customized actions
            playerTemplate.actions.forEach(action => {
                if (!action.leveling) {
                    action.leveling = defaultActionLeveling();
                }
            });

            //Add action leveling into the processing array
            if (!moduleProcessing.find(processActionLeveling)) {
                moduleProcessing.push(processActionLeveling);
            }
        }
        

///////// Cooldown Module ///////////////////////////////////////////////////////////////////////// 
        
        
        /**
         * The actions cool down subsystem.
         * @param {boolean} enabled Enables the action cool down system
         * @param {number} decreaseRatePerAction How quick the cool down timer goes down per player turn
         * @param {number} failureThreshold The failure threshold for when to cool down actions
         * @param {number} failureCount The current count
         * @param {number} remainingTurns The remaining Cool down turns
         */
        class CoolDown {
            constructor(
                enabled = true, //Enable the action cool down subsystem 
                decreaseRatePerAction = 1, // The rate of decrease per turn.
                failureThreshold = 3, // The failure threshold at which to activate the cool down
                failureCount = 0, // The current failure count.
                remainingTurns = 0 // Turns remain on cool down.
            ) {
                this.enabled = enabled;
                this.decreaseRatePerAction = decreaseRatePerAction;
                this.failureThreshold = failureThreshold;
                this.failureCount = failureCount;
                this.remainingTurns = remainingTurns;
            }
        }

        /**
         * Logic for handling non-active actions
         * @param {string} activeAction The Name of the action being used actively and action being ignored for updates.
         * @param {boolean} isSuccess Whether or not the action was successful
         */
        const processActionCooldown = (activeAction, isSuccess) => {
            //Active actions
            

            if (!isSuccess && action.coolDown.enabled) {
                action.coolDown.failureCount += 1;

                if (action.coolDown.failureCount >= action.coolDown.threshold) {
                    action.coolDown.remainingTurns = action.coolDown.threshold;
                }
            }
        //Inactive actions
            
            //
            state.player.actions.forEach(action => {
                if (action.name !== activeAction.name) {
                    //lowers cooldown timer for all actions that need it
                    if (action.coolDown > 0) {
                        action.coolDown -= action.coolDown.decreaseRatePerAction;
                    }
                }
            });
        }

///////// Threat Module ///////////////////////////////////////////////////////////////////////////

        /**
         * The threat system for use during 'low' player activity. The system system is activated off a lack of player action over time.
         * @param {boolean} enabled Enabled the player activity threat system
         * @param {number} threshold The threshold to drop below before activating
         * @param {number} active The current count of active turns
         * @param {number} inactive The current count of inactive turns
         * @param {string[]} array The outcomes you might encounter for player inaction
         */
        class Threat {
            constructor(
                enabled, 
                threshold, 
                active, 
                inactive, 
                array) {
                this.enabled = enabled;
                this.threshold = threshold;
                this.active = active;
                this.inactive = inactive;
                this.array = array;
            }
        }


//////// Event Module /////////////////////////////////////////////////////////////////////////////

        


        /**
         * The event for the event system.
         * @param {number} chance The chance this can be the event
         * @param {string} description The description of the event to be presented to the AI
         */
        class Event {
            constructor(chance, description) {
                this.chance = chance;
                this.description = description;
            }
        }

        /**
         * An event system.
         * @param {string} name The name of id to find the event.
         * @param {EventType} events An array of events posable in this scenario.
         * @param {*} chance The likelihood of the event changing.
         */
        class EventType {
            constructor(name, events, chance) {
                this.name = name;
                this.events = events;
                this.chance = chance;
                this.current = getRandomItem(events);
                this.description = this.current.description;
                this.isRandom = true
            }

        }

        const EVENTS = [ 
            new EventType(
                "Natural Weather",
                [
                    new Event(.05, "It is thundering outside."),
                    new Event(.1, "There are clouds and precipitation outside."),
                    new Event(.15, "There are clouds outside."),
                    new Event(.25, "There is a thick fog outside."),
                    new Event(1, "It is clear outside."),
                ],
                0.1
            ),
            new Event(
                "Feeling",
                [
                    new Event(.05, "You feel upset."),
                    new Event(.10, "You feel betrayed."),
                    new Event(.15, "You feel emotional hurt."),
                    new Event(.20, "You are sad."),
                    new Event(.25, "You are depressed."),
                    new Event(.30, "You feel happy."),
                    new Event(.35, "You feel evil."),
                    new Event(.40, "You feel generous."),
                    new Event(.45, "You feel selfish."),
                    new Event(.50, "You need attention from another person."),
                    new Event(.55, "You need the comfort of home."),
                    new Event(1, ""),
                ],
                0.1
            )
        ];

        /**
         * 
         * @param {*} eventSystem 
         */
        const processEvents = () => {
            state.game.eventSystem.forEach((eventSystem) => {
                if (Math.random() < eventSystem.chance) {
                    if (eventSystem.isRandom) {
                        const random = Math.random();
                        eventSystem.events.every(e => {
                            if (random < e.chance) {
                                eventSystem.current = e;
                                eventSystem.description = e.description;
                                return false;
                            }
                        });
                    } else {
                        eventSystem.current = getNextItem(eventSystem.events, eventSystem.events.indexOf(e => e.description === eventSystem.current.description));
                    }
                }
            })};


        /**
        * Get currently active events.
        */
        const getEvent = () => {
            if (state.game) {
                return state.game.eventSystem.map(e => e.description);
            }
            return [];
        }

        if (true) { //<<<<<<<<<      TOGGLE EVENTS: (true) to turn on. (false) to turn off      <<<<<<<<<//

            //Add action leveling into the processing array
            if (!moduleProcessing.find(processEvents)) {
                moduleProcessing.push(processEvents);
            }

            if(!state.game.eventSystem) {
                state.game.eventSystem = EVENTS;
            }

        }


//////// Exhaustion Module ////////////////////////////////////////////////////////////////////////


        /**
         * The player exhaustion tracking system.
         * @param {boolean} enabled If the system is active and in use.
         * @param {number} threshold The threshold at which the system activates.
         * @param {number} inactive Turns of inactivity.
         * @param {number} active Turns of activity.
         * @param {string} message The message to display when exhausted.
         */
        class Exhaustion {
            constructor(enabled, threshold, inactive, active, message) {
                this.enabled = enabled;
                this.threshold = threshold;
                this.inactive = inactive;
                this.active = active;
                this.message = message;
            }
        }

//////// Reputation Module ////////////////////////////////////////////////////////////////////////

////////End module addition section////////////////////////////////////////////////////////////////







        /**
         * Gets action names / handles logic for dynamic action creation
         */
        const getActionByName = (player, capturedActionName) => {
            if (state.game.dynamicActions) {
                let action = player.actions.find(action => action.name.includes(capturedActionName.toLowerCase()));
                if (!action) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(capturedActionName.toLowerCase());
                    action = new Action(names);
                    player.actions.push(action); // Add the new action to the actions array
                }
                return action;
            }
            return player.actions.find(action => action.name.includes(capturedActionName.toLowerCase())) || player.actions[0];
        }

        const suddenly = () => {
            if (!state.game.playerActivity.threat.enabled) return "";
            const activity = Math.max(state.game.playerActivity.threat.active, state.game.playerActivity.threat.inactive);
            if (activity < state.game.playerActivity.threat.threshold) {
                // add to authors notes
                return getRandomItem(state.game.playerActivity.threat.array);
            }
            return "";
        }



        /**
         * Gets the players status.
         * @returns The status.
         */
        const getPlayerStatus = () => {
            const status = [
                ...state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0).map(a => a.coolDownPhrase),
                state.player.status.trim(),
                suddenly().trim()]
                .join(" ")
                .trim();
            if (status.length > 0) {
                return `[Your status: ${status}]`;
            }
            return "";
        }

        /**
         * Gets the players status for the message.
         * @returns The status.
         */
        const getPlayerStatusMessage = () => {
            const status = state.player.actions.filter(a => a.coolDown.enabled && a.coolDown.remainingTurns > 0)
                .map(a => `${a.name[0]} is cooling down for ${a.coolDown.remainingTurns} turns. Causing: "${a.coolDownPhrase}"`);
            if (status.length > 0) {
                return status;
            }
            return "";
        }


        /**
         * Gets the success/failure phrase
         * @param {action} action The action to get the phrase from.
         * @returns The phrase relent to the actions success or failure.
         */
        const getPhrase = (action, isSuccess) => {
            const successPhrase = action => `[Success! ${action.successStart} ${getRandomItem(action.successEndings)}.]`;
            const failurePhrase = action => `[Fail!${action.failureStart} ${getRandomItem(action.failureEndings)}]`;
            const note = action => action.note !== "" ? ` [${action.name[0]} Action Note: ${action.note}]` : "";
            if (action.coolDown.remainingTurns > 0) {
                return `[${action.coolDownPhrase}]`;
            }
            return note(action) + (isSuccess ? successPhrase(action) : failurePhrase(action));
        }


        const getReputation = () => {
            let rep = [];
            state.player.actions.forEach(action => {
                const triggeredRep = state.player.actionHistory.filter(ah => ah.name === action.name[0]);
                if (triggeredRep.length > action.memorableThreshold) {
                    rep.push(action.knownFor);
                }
            });
            return rep;
        }


        /**
         * Determine success or failure of a action
         * @param {action} action The action to check.
         * @returns {boolean} The success or failure of the action check.
         */
        const determineFate = (action) => {
            if (action.coolDown.enabled && (action.coolDown.remainingTurns > 0)) {
                return false;
            }
            const success = (Math.random() < action.rate);
            const message = success ? `Your ${action.name[0]} check succeeded.` : `Your ${action.name[0]} check failed.`
            state.game.messages = [message];
            return success;
        }


        /**
         * Logic for handling the players reputation
         * @param {string} action The name of the action being processed
         * @param {boolean} success A boolean denoting whether the action was successful or not
         */
        const processReputation = (action, isSuccess) => {
            if (isSuccess) {
                if (state.game.enableReputationSystem && (Math.random() < action.memorable)) {
                    state.player.actionHistory.push(new ActionHistory(action.name[0], info.actionCount));
                    state.player.actionHistory = state.player.actionHistory.filter(ah => ah.actionCount > Math.max(0, info.actionCount - 50));
                }
            }
        }

        


        


        /**
         * Logic for handling the player activity. Handles both the exhaustion and threat mechanics
         * @param {boolean} active If the player turn is an active one
         */
        const processPlayerActivity = (active) => {
            if (!state.game.playerActivity.exhaustion.enabled) return;

            if (active) {
                state.game.playerActivity.exhaustion.inactive = 0;
                state.game.playerActivity.exhaustion.active += 1;
                state.game.playerActivity.threat.active += 1;
                checkWithinBounds((state.game.playerActivity.threat.inactive - 1), 0);
            }
            else {
                state.game.playerActivity.exhaustion.active = 0;
                state.game.playerActivity.exhaustion.inactive += 1;
                state.game.playerActivity.threat.inactive += 1;
                checkWithinBounds(state.game.playerActivity.threat.active - 1, 0);
            }

            if (state.game.playerActivity.inactive > state.game.playerActivity.exhaustion.threshold) {
                state.player.status = "";
            }
            else if (state.game.playerActivity.exhaustion.active > state.game.playerActivity.exhaustion.threshold) {
                state.player.status = `[${state.game.playerActivity.exhaustion.message}]`;
            }
            else {
                state.player.status = "";
            }
        }


        /**
         * The action command parse for use as command parse and entry point.
         * @param {string} text The user imputed text.
         */
        const actionParse = (text) => {
            
            const actionRegex = /> (.*) (?:(try|tries|attempt|attempts) to use (.*) to |(try|tries|attempt|attempts) to |(?:say|says) "([^"]+)")/i;
            const match = text.match(actionRegex);

            if (match) {
                let action = null;
                let playerName = match[1];
                let isSuccess;
                let player = state.game.getPlayer(playerName);

                if (match[3]) {  // If action name is captured

                    action = getActionByName(player, match[3]);
                    isSuccess = determineFate(action);
                    state.memory.frontMemory = getPhrase(action, isSuccess);

                    processActionLeveling(action, isSuccess);
                    processReputation(action, isSuccess);
                    processPlayerActivity(true);
                    processActionCooldown(action, isSuccess);
                }
                else if (match[5]) {  // If speech is captured

                    if (state.game.enableSayCharismaCheck) {
                        
                        action = getActionByName(player, "charisma");
                        isSuccess = determineFate(action);
                        state.memory.frontMemory = getPhrase(action, isSuccess);

                        processActionLeveling(action, isSuccess);
                        processReputation(action, isSuccess);
                        processPlayerActivity(false);
                        processActionCooldown(action, isSuccess);
                    }
                }

                else {

                    action = getActionByName(player, "default");
                    isSuccess = determineFate(action);
                    state.memory.frontMemory = getPhrase(action, isSuccess);

                    processActionLeveling(action, isSuccess);
                    processReputation(action, isSuccess);
                    processPlayerActivity(true);
                    processActionCooldown(action, isSuccess);
                }
            }
            
            else {
                checkWithinBounds(0, state.game.playerActivity.threat.active - 1);
                checkWithinBounds(0, state.game.playerActivity.threat.inactive - 1);
                state.memory.frontMemory = "";  // No relevant action found
            }
        }

        // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
        actionParse(text);

        state.memory.authorsNote = [
            getPlayerStatus(),
            getEvent(),
            getReputation(),
            state.game.authorsNote,
        ].filter(e = e => e !== "").join(" ").trim();

        // Notify the player of the status.
        if (state.game.enablePlayerMessage) {
            state.message = [state.game.messages, ...getPlayerStatusMessage()].filter(m => m !== "").join("\n").trim();
            state.game.message = [];
        }

        return { state, text, history, storyCards, info }
    }

    oracle(state, text, history, storyCards, info);
    return { text }
}

// Don't modify this part
modifier(text)