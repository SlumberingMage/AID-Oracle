// Every script needs a modifier function
const modifier = (text) => {

    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++
    // DO NOT EDIT THIS SECTION
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++

    // This is the default rate for a new action.
    // Do not change this function, change the values in defaultActionRate.
    // Helper functions

    /**
     * Gets a random item from an array.
     * @param {[]} arr An array of items.
     * @returns A random item from the array or null if the array is empty.
     */
    const getRandomItem = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)] || null;
    }

    /**
     * Gets the next item in the array.
     * @param {[]} arr Array of items.
     * @param {Number} currentIndex The current index.
     * @returns The next item in the array.
     */
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
     * @param {Number} number number to check
     * @param {Number} lowerBound
     * @param {Number} upperBound
     * @returns Adjusted number
     *  ----------------------------------
     * Accounts for only a lower bound
     * @param {Number} number number to check
     * @param {Number} lowerBound
     * @returns Adjusted number
     */
    const checkWithinBounds = (number, lowerBound, upperBound) => {
        if (upperBound === undefined) {
            return Math.max(number, lowerBound);
        } else {
            return Math.min(Math.max(number, lowerBound), upperBound);
        }
    }

    /**
     * Gets a random starting action rate.
     * @param {Number} starting The base starting number
     * @param {Number} min The minimum value to be added.
     * @param {Number} max The maximum value to be added.
     * @returns The starting action rate.
     */
    const startingActionRate = (starting, min, max) => {
        return starting + (Math.random() * (min - max) + max)
    }

    /**
     * Gets the correct is or are for the point of view.
     * @param {String} who Who is the POV for.
     * @returns The correct is or are for the POV.
     */
    const getCopular = (who) => {
        switch (who) {
            case "You":
                return "are";
            case "I":
                return "am";
            default:
                return "is";
        }
    }

    /**
     * The starting action rates.
     * @param {Number} starting The minimum value for an action.
     * @param {Number} MaxBonusRate The max starting bonus rate.
     * @param {Number} MinBonusRate The min starting bonus rate.
     */
    class ActionRate {
        constructor(actionRate) {
            this.starting = actionRate.starting;
            this.MaxBonusRate = actionRate.MaxBonusRate;
            this.MinBonusRate = actionRate.MinBonusRate;
        }
    }

    /**
     * The event for the event system.
     * @param {Number} chance The chance this can be the event
     * @param {String} description The description of the event to be presented to the AI
     */
    class EventType {
        constructor(eventType) {
            this.chance = eventType.chance;
            this.description = eventType.description;
        }
    }

    /**
     * Represents an event system.
     * @class
     */
    class EventSystem {
        /**
         * Represents a constructor for the event system.
         * @param {Object} eventSystem - The event system object.
         * @param {String} eventSystem.name - The name of the event system.
         * @param {Array} eventSystem.events - The events associated with the event system.
         * @param {Number} eventSystem.chance - The chance of an event changing.
         * @param {Number} eventSystem.current - The current event.
         * @param {String} eventSystem.description - The description of the event system.
         * @param {Boolean} eventSystem.isRandom - Indicates if events are chosen randomly or in sequence.
         */
        constructor(eventSystem) {
            this.name = eventSystem.name;
            this.events = eventSystem.events.map(e => new EventType(e));
            this.chance = eventSystem.chance;
            this.current = eventSystem.current;
            this.description = eventSystem.description;
            this.isRandom = eventSystem.isRandom;
        }
        /**
         * Changes the event.
         */
        changeEvent(chance) {
            if (chance < this.chance) {
                if (this.isRandom) {
                    const random = Math.random();
                    this.events.forEach(e => {
                        if (random < e.chance) {
                            this.current = e;
                            this.description = e.description;
                        }
                    });
                } else {
                    this.current = getNextItem(this.events, this.events.indexOf(e => e.description === this.current.description));
                }
            }
        }
    }

    /**
     * The player exhaustion tracking system.
     * @param {Boolean} enabled If the system is active and in use.
     * @param {Number} threshold The threshold at which the system activates.
     * @param {Number} inactive Turns of inactivity.
     * @param {Number} active Turns of activity.
     * @param {String} message The message to display when exhausted.
     */
    class Exhaustion {
        constructor(exhaustion) {
            this.enabled = exhaustion.enabled;
            this.threshold = exhaustion.threshold;
            this.inactive = exhaustion.inactive;
            this.active = exhaustion.active;
            this.message = exhaustion.message;
        }
    }

    /**
     * The threat system for use durning 'low' player activity. The system system is activated off a lack of player action over time.
     * @param {Boolean} enabled Enabled the player activity threat system
     * @param {Number} threshold The threshold to drop below before activating
     * @param {Number} active The current count of active turns
     * @param {Number} inactive The current count of inactive turns
     * @param {String[]} array The outcomes you might encounter for player inaction
     */
    class Threat {
        constructor(threat) {
            this.enabled = threat.enabled;
            this.threshold = threat.threshold;
            this.active = threat.active;
            this.inactive = threat.inactive;
            this.array = threat.array;
        }
    }

    /**
     * The leveling information for an action.
     * @param {Boolean} increaseEnabled Allow action increase
     * @param {Boolean} decreaseEnabled Allow action decrease
     * @param {Number} maxRate The actions maximum rate
     * @param {Number} minRate The actions minimum rate
     * @param {Number} rateOfChange The base rate of action change
     * @param {Number} rateOfChangeFailureMultiplier The experience failure multiplier
     * @param {Number} decreaseRate The rate of action decrease. I recommend it be the success experience divided by less than the number of actions
     */
    class Leveling {
        constructor(leveling) {
            this.increaseEnabled = leveling.increaseEnabled;
            this.decreaseEnabled = leveling.decreaseEnabled;
            this.maxRate = leveling.maxRate;
            this.minRate = leveling.minRate;
            this.rateOfChange = leveling.rateOfChange;
            this.rateOfChangeFailureMultiplier = leveling.rateOfChangeFailureMultiplier;
            this.decreaseRate = leveling.decreaseRate;
        }
    }

    /**
     * The actions cool down subsystem.
     * @param {Boolean} enabled Enables the action cool down system
     * @param {Number} decreaseRatePerAction How quick the cool down rate goes down per player turn
     * @param {Number} failureThreshold The failure threshold for when to cool down actions
     * @param {Number} failureCount The current count
     * @param {Number} remainingTurns The remaining number of turns an action is cooling down
     */
    class CoolDown {
        constructor(coolDown) {
            this.enabled = coolDown.enabled;
            this.decreaseRatePerAction = coolDown.decreaseRatePerAction;
            this.failureThreshold = coolDown.failureThreshold;
            this.failureCount = coolDown.failureCount;
            this.remainingTurns = coolDown.remainingTurns;
        }

        /**
         * Increases the cool down.
         */
        increase() {
            if (this.enabled) {
                this.failureCount = Math.min(this.failureThreshold, this.failureCount + 1);
                if (this.failureCount >= this.failureThreshold) {
                    this.remainingTurns = this.failureThreshold;
                    this.failureCount = 0;
                }
            }
        }
        /**
         * Decreases the cool down.
         */
        decrease() {
            if (this.enabled) {
                this.failureCount = Math.max(0, this.failureCount - this.decreaseRatePerAction);
            }
        }
    }

    class ActionHistory {
        constructor(actionHistory) {
            this.actionCount = actionHistory.actionCount;
            this.name = actionHistory.name;
        }
    }

    class ResourceThreshold {
        constructor(resourceThreshold) {
            this.threshold = resourceThreshold.threshold;
            this.message = resourceThreshold.message;
        }
    }

    class Resource {
        constructor(resource) {
            this.type = resource.type;
            this.isIncreased = resource.isIncreased;
            this.value = resource.value;
            this.max = resource.max;
            this.min = resource.min;
            this.rate = resource.rate;
            this.isCritical = resource.isCritical;
            this.isConsumable = resource.isConsumable;
            this.isRenewable = resource.isRenewable;
            this.thresholds = resource.thresholds.map(t => new ResourceThreshold(t));
        }
    }

    class ActionResource {
        constructor(actionResource) {
            this.type = actionResource.type;
            this.isIncreasing = actionResource.isIncreasing;
            this.onSuccess = actionResource.onSuccess;
            this.modify = actionResource.modify;
        }
    }

    class Action {
        constructor(action) {
            this.name = action.name;
            this.successEndings = action.successEndings;
            this.failureEndings = action.failureEndings;
            this.successStart = action.successStart;
            this.failureStart = action.failureStart;
            this.coolDownPhrase = action.coolDownPhrase;
            this.note = action.note;
            this.rate = parseFloat(action.rate);
            this.leveling = new Leveling(action.leveling);
            this.coolDown = new CoolDown(action.coolDown);
            this.memorable = action.memorable;
            this.knownFor = action.knownFor;
            this.memorableThreshold = action.memorableThreshold;
            this.isResource = action.isResource;
            this.resources = action.resources.map(r => new ActionResource(r));
            this.preventAction = {};
        }

        /**
         * Gets the phrase for the action.
         * For example, "You try to move the rock. and You successfully, manage to be masterful."
         * @param {Boolean} isSuccess
         * @returns {String} The phrase for the action.
         */
        getPhrase(isSuccess) {
            const note = this.note !== "" ? ` [${this.name[0]} Action Note: ${this.note}]` : "";
            const adjective = getRandomItem(isSuccess ? this.successEndings : this.failureEndings);
            const message = `${isSuccess ? this.successStart : this.failureStart} ${adjective}${note}${isSuccess ? "." : "!"}`;
            return (isSuccess ? " And " : " But ") + message;
        }

        updateRate(isSuccess, isActiveAction) {

            const newRate = this.rate + (this.leveling.rateOfChange * (isSuccess ? 1 : this.leveling.rateOfChangeFailureMultiplier));
            //Processes the action used by a user
            if (isActiveAction) {

                if (newRate >= this.rate && this.leveling.increaseEnabled) {
                    this.rate = Math.min(newRate, this.leveling.maxRate);
                }
                if (newRate < this.rate && this.leveling.decreaseEnabled) {
                    this.rate = Math.max(newRate, this.leveling.minRate);
                }
            }

            else if (this.leveling.decreaseEnabled) {
                this.rate = Math.max(this.leveling.minRate, this.rate - this.leveling.decreaseRate);
            }
        }
    }



    class StatusEffects {
        constructor(statusEffects) {
            // The status effects are enabled
            this.enabled = statusEffects.enabled;
            // The effects of the status, this is an array of actions this status effects.
            this.effects = statusEffects.effects;
            // The type of status effect, this is a string and should match an action.
            this.type = statusEffects.type;
            // The message for the status effect.
            this.message = statusEffects.message;
            // The note for the status effect, this is presented to the author's notes.
            this.note = statusEffects.note;
            // The value of the status effect.
            this.value = statusEffects.value;
            // If the value increases or decreases.
            this.isBuff = statusEffects.isBuff;
            // If the status effect is permanent.
            this.isPermanent = statusEffects.isPermanent;
            // If the status effect is temporary.
            this.isTemporary = statusEffects.isTemporary;
            // The duration of the status effect.
            this.duration = statusEffects.duration;
            // The remaining turns of the status effect.
            this.remainingTurns = statusEffects.remainingTurns;
        }
    }

    /**
     * Represents a player in the game.
     * @class
     */
    class Player {
        constructor(player) {
            this.name = player.name;
            this.status = player.status;
            this.resources = player.resources.map(r => new Resource(r));
            this.actions = player.actions.map(a => new Action(a));
            this.actionHistory = player.actionHistory.map(a => new ActionHistory(a));
            this.eventSystem = player.eventSystem.map(e => new EventSystem(e));
            this.exhaustion = new Exhaustion(player.exhaustion);
            this.threat = new Threat(player.threat);
            this.disableActions = {};
        }

        updateActions(actionName, isSuccess) {
            this.actions.forEach(currentAction => {
                currentAction.updateRate(isSuccess, currentAction.name.includes(actionName));
            });
        }

        getCoolDownPhrase() {
            return this.actions.filter(a => a.coolDown.remainingTurns > 0 && a.coolDown.enabled).map(a => a.coolDownPhrase).filter(e => e != "");
        }

        getStatus() {
            const exhaustion = this.exhaustion.enabled && this.exhaustion.active > this.exhaustion.threshold ? this.exhaustion.message : "";
            const status = [
                exhaustion,
                ...this.getCoolDownPhrase(),
                ...this.getReputation(),
                ...this.getResourceThresholds()
            ].filter(e => e !== "").join(", ").trim()


            return status.length > 0 ? `[${this.name} ${getCopular(this.name)}, ${status}.]` : "";
        }

        getReputation() {
            let rep = [];
            this.actions.forEach(a => {
                const triggeredRep = this.actionHistory.filter(ah => ah.name === a.name[0]);
                if (triggeredRep.length > a.memorableThreshold) {
                    rep.push(a.knownFor);
                }
            });
            return rep;
        }

        getResourceThresholds() {
            return this.resources.map(r => r.thresholds.find(t => r.value <= t.threshold)).filter(e => e).map(e => e.message);
        }

        setResources(isSuccess, actionName) {
            const action = this.actions.find(a => a.name.includes(actionName) && a.isResource);
            if (action) {
                action.resources.forEach(actionResource => {
                    const resource = this.resources.find(r => r.type === actionResource.type);
                    if (actionResource.isIncreasing && actionResource.onSuccess && isSuccess) {
                        resource.value = Math.min(resource.max, resource.value + actionResource.modify);
                    }
                    if (!actionResource.isIncreasing && (actionResource.onSuccess && isSuccess)) {
                        resource.value = Math.max(resource.min, resource.value - actionResource.modify);
                    }
                    if (actionResource.isIncreasing && !actionResource.onSuccess && !isSuccess) {
                        resource.value = Math.min(resource.max, resource.value + actionResource.modify);
                    }
                    if (!actionResource.isIncreasing && !actionResource.onSuccess && !isSuccess) {
                        resource.value = Math.max(resource.min, resource.value - actionResource.modify);
                    }
                });
            }
        }
    }

    class Game {
        constructor(game) {
            this.dynamicActions = game.dynamicActions;
            this.enableReputationSystem = game.enableReputationSystem;
            this.enableSayCharismaCheck = game.enableSayCharismaCheck;
            this.isDynamicPlayersEnabled = game.isDynamicPlayersEnabled;
            this.eventSystem = game.eventSystem.map(e => new EventSystem(e));
            this.eventSystemEnabled = game.eventSystemEnabled;
            this.authorsNote = game.authorsNote;
            this.actionRate = new ActionRate(game.actionRate);
            this.players = game.players.map(p => new Player(p));
            this.resources = game.resources.map(r => new Resource(r));
            this.enablePlayerMessage = game.enablePlayerMessage;
            this.messages = game.messages;
            this.actionHistorySize = game.actionHistorySize;
        }
    }
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++
    // END DO NOT EDIT SECTION
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++


    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++
    // START EDIT SECTION
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++

    // Notes: The more you add the larger the game state will be. Keep that in mind when adding new actions.
    // I have not tested the system with more than 5 actions. If you add more, you may need to adjust the decrease rate in the leveling object to match the number of actions.
    // Testing is recommended after adding new actions to ensure the system is working as expected.
    // The system is designed to be flexible and allow for a wide range of actions and systems to be added.

    // This section can be customized to fit the need of the game.
    // Change the values below to fractions of a whole number to affect the script.
    const defaultActionRate = {
        // I recommend this be set to .5 for easy and .2 for hard.
        starting: .3,
        // The maximum starting bonus for an action.
        MaxBonusRate: .2,
        // The minimum starting bonus for an action.
        MinBonusRate: .01,
        // The max rate for an action.
        // I do not recommend setting this to above .95.
        max: .95,
        // The min rate for an action.
        // I do not recommend setting this to below .05.
        min: .05
    }

    // Feel free to change the values below to customize the default action but only the text values except for the name default.
    const defaultAction = {
        // The name of the action, this is default name and should not be changed.
        name: ["default"],
        // The success endings for the action.
        // Add as many as you like but keep one in the array.
        // The system randomly selects one of the endings for the action.
        successEndings: ["masterful", "remarkable", "flawless"],
        // Add as many as you like but keep one in the array.
        // The system randomly selects one of the endings for the action.
        failureEndings: ["clumsy", "inept", "futile"],
        // The start of the success message as seen by the AI.
        // The message is combined with the success ending to form the full message.
        // Example: "You try to move the rock. and You successfully, manage to be masterful."
        // Example: "Bob tries to move the rock. and Bob successfully, manage to be masterful."
        successStart: "successfully, manage to be",
        // The start of the failure message as seen by the AI.
        // The message is combined with the failure ending to form the full message.
        // Example: "You try to move the rock. and You failing, it ends up being clumsy."
        // Example: "Bob tries to move the rock. and Bob failing, it ends up being futile."
        failureStart: "fail, managing to be",
        // The message to display when the action is on cool down.
        coolDownPhrase: "unable to act",
        // The note for the action, that are added to author notes for special actions.
        // This is a good place to add special rules for the action.
        note: "",
        // The rate of success for the action.
        // For both success and failure, the rate should be between the min and max for action rate.
        rate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
        leveling: {
            // Allow the action to increase in rate.
            // This is disabled for the default action.
            increaseEnabled: false,
            // Allow the action to decrease in rate.
            // This is disabled for the default action.
            decreaseEnabled: false,
            // The max rate for the action.
            maxRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
            // The min rate for the action.
            minRate: defaultActionRate.starting + defaultActionRate.MaxBonusRate,
            // The rate of change for the action.
            // IE how much the action rate changes per leveling event.
            rateOfChange: 0,
            // The rate of change multiplier for failure.
            // This is used to increase the rate of change for failure action.
            // This should be a positive number or fraction.
            rateOfChangeFailureMultiplier: 1,
            // The rate of decrease for the action.
            // This is used to decrease the rate of the action over time due to inactivity.
            decreaseRate: 0
        },
        coolDown: {
            // Enable the cool down system for the action.
            // This is disabled for the default action.
            enabled: false,
            // The rate at which the cool down decreases.
            decreaseRatePerAction: 1,
            // The failure threshold for the cool down system.
            failureThreshold: 3,
            // The current count of failures.
            failureCount: 0,
            // How many turns the action is on cool down.
            remainingTurns: 0
        },
        // Is the action memorable.
        // This is used to track the actions that are memorable.
        memorable: true,
        // What the player is known for.
        // This is used to track the actions that are memorable.
        // This is added to player status if the action is memorable and the player has triggered the memorable threshold.
        knownFor: "being average",
        // The threshold for the action to be memorable.
        memorableThreshold: 3,
        // Is the action a resource action.
        isResource: false,
        // The resource the action affects.
        resources: [],
    };

    // Feel free to change the values below to customize the default charisma action but only the text values except for the name charisma.
    const defaultCharismaAction = {
        name: ["charisma", "speech", "diplomacy", "words", "speak", "converse", "influence", "charm", "convene", "convince", "coax", "reason", "persuade", "persuasion", "encourage", "encouragement", "win over", "assure", "reassure", "reassurance", "comfort", "intimidate"],
        successEndings: ["persuasive", "charming", "full of conviction"],
        failureEndings: ["awkward", "unconvincing", "ineffectual"],
        successStart: "the words are",
        failureStart: "the words are",
        coolDownPhrase: "unable to make sense",
        note: "",
        rate: .5,
        leveling: {
            increaseEnabled: true,
            decreaseEnabled: true,
            maxRate: defaultActionRate.max,
            minRate: defaultActionRate.min,
            rateOfChange: 0.01,
            rateOfChangeFailureMultiplier: 10,
            decreaseRate: 0.001 / 6
        },
        coolDown: {
            enabled: true,
            decreaseRatePerAction: 1,
            failureThreshold: 3,
            failureCount: 0,
            remainingTurns: 3
        },
        memorable: true,
        knownFor: "a skilled linguist",
        memorableThreshold: 3,
        isResource: false,
        resources: [],
    };

    // Custom actions is an array of actions that can be added to the game. Define as many as you like, but make sure to lower the decreaseRate in the leveling object to match the number of actions including the charisma action but not the default action.
    const customActions = [
        {
            // This is an example of a custom action.
            // The name of the action, this is what will trigger the system to use this action.
            // Add as many names as you like, but the first name should be the primary name.
            name: ["fighting", "combat", "weapon", "hit", "strike", "attack", "counter", "counterattack", "assault", "ambush"],
            successEndings: ["brutal efficiency", "deadly precision", "unyielding determination"],
            failureEndings: ["misjudged", "ineffective", "reckless"],
            successStart: "the attack is made with",
            failureStart: "the attack proves",
            coolDownPhrase: "venerable to attack",
            note: "",
            rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: defaultActionRate.max,
                minRate: defaultActionRate.min,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: 10,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: false,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 3
            },
            memorable: true,
            knownFor: "a skilled fighter",
            memorableThreshold: 3,
            isResource: true,
            resources: [{
                type: "health",
                isIncreasing: false,
                modify: 3,
                onSuccess: false
            }]
        },
        {
            name: ["movement", "move", "running", "jumping", "dodge", "agility", "muscle memory", "leap", "leaping", "sneak", "stealth", "climb", "climbing", "parry", "escape", "free yourself", "maneuver", "duck"],
            successEndings: ["agile", "graceful", "fluid"],
            failureEndings: ["unprepared", "reckless", "awkward"],
            successStart: "the movement is successfully and",
            failureStart: "the attempt to move was",
            coolDownPhrase: "barely able to move",
            note: "",
            rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: defaultActionRate.max,
                minRate: defaultActionRate.min,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: 10,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: false,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            memorable: true,
            knownFor: "parkour master",
            memorableThreshold: 3,
            isResource: false,
            resources: [],
        },
        {
            name: ["observe", "look", "watch", "inspect", "investigate", "examine", "listening", "hearing", "smell", "intuition", "analyze", "analysis", "deduce", "deduction", "decode", "assess", "sniff", "scent"],
            successEndings: ["perceptive", "attentive", "detailed"],
            failureEndings: ["overlooking", "being distracted", "lack of depth"],
            successStart: "the observation is successful and",
            failureStart: "failing to notice the details you fail by",
            coolDownPhrase: "unable to focus",
            note: "",
            rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: defaultActionRate.max,
                minRate: defaultActionRate.min,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: .5,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: true,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            memorable: true,
            knownFor: "a keen observer",
            memorableThreshold: 3,
            isResource: false,
            resources: [],
        },
        {
            name: ["performance", "dancing", "singing", "jokes"],
            successEndings: ["perceptive", "engaging", "lively"],
            failureEndings: ["overlooked", "distracted", "bland"],
            successStart: "the preform performance is",
            failureStart: "despite the efforts, the performance is",
            coolDownPhrase: "preforming poorly",
            note: "",
            rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: defaultActionRate.max,
                minRate: defaultActionRate.min,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: 3,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: true,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            memorable: true,
            knownFor: "a skilled performer",
            memorableThreshold: 3,
            isResource: false,
            resources: [],
        },
        {
            name: ["first-aid", "medicine", "medical"],
            successEndings: ["life saving", "skillful", "precise"],
            failureEndings: ["misjudged", "ineffective", "reckless"],
            successStart: "the first-aid attempt succeeds and is",
            failureStart: "the attempt at first-aid proves",
            coolDownPhrase: "are out of first-aid supplies",
            note: "",
            rate: startingActionRate(defaultActionRate.starting, defaultActionRate.min, defaultActionRate.max),
            leveling: {
                increaseEnabled: true,
                decreaseEnabled: true,
                maxRate: defaultActionRate.max,
                minRate: defaultActionRate.min,
                rateOfChange: 0.01,
                rateOfChangeFailureMultiplier: 10,
                decreaseRate: 0.001 / 6
            },
            coolDown: {
                enabled: true,
                decreaseRatePerAction: 1,
                failureThreshold: 3,
                failureCount: 0,
                remainingTurns: 0
            },
            memorable: true,
            knownFor: "a skilled healer",
            memorableThreshold: 3,
            isResource: true,
            resources: [{
                type: "health",
                isIncreasing: true,
                modify: 3,
                onSuccess: true
            }]
        }
    ]

    // DO NOT CHANGE THIS FUNCTION!
    const defaultActions = () => {
        return [
            defaultAction,
            defaultCharismaAction,
            ...customActions
        ];
    }

    const defaultPlayerYou = {
        // The name of the player.
        name: "You",
        // The status of the player.
        status: "",
        // The size of the Action history.
        // The more actions the player can take the larger this number should be, or the longer the history.
        // A long history is best used with lots of actions or high thresholds for memorable actions.
        actionHistorySize: 10,
        // The actions the player can take.
        actions: defaultActions(),
        // The action history of the player. Used for tracking memorable actions and player reputation.
        actionHistory: [
            { actionCount: 1, name: "default" },
            { actionCount: 1, name: "charisma" },
            { actionCount: 1, name: "fighting" },
            { actionCount: 1, name: "fighting" },
            { actionCount: 1, name: "fighting" },
            { actionCount: 1, name: "fighting" },
            { actionCount: 1, name: "movement" },
            { actionCount: 1, name: "movement" },
            { actionCount: 1, name: "movement" },
            { actionCount: 1, name: "observe" },
            { actionCount: 1, name: "performance" },
            { actionCount: 1, name: "first-aid" },
            { actionCount: 1, name: "fighting" },
        ],
        // The exhaustion system for the player.
        exhaustion: {
            // Enable the exhaustion system.
            enabled: true,
            // The threshold for the exhaustion system.
            // This is the number of actions before the system activates.
            threshold: 10,
            // The number of inactive turns.
            inactive: 0,
            // The number of active turns.
            active: 0,
            // The message to display when the player is exhausted. This is added to the player status.
            message: "exhausted"
        },
        // The threat system for the player.
        threat: {
            // Enable the threat system.
            enabled: true,
            // The threshold for the threat system.
            threshold: 10,
            // The number of active turns.
            active: 0,
            // The number of inactive turns.
            inactive: 11,
            // The outcomes for the threat system when the player is inactive.
            // Add as many as you like but keep one in the array.
            // The system randomly selects one of the outcomes for the player inaction.
            array: [
                "A text message pops up.",
                "A strange noise is heard.",
                "You notice something new about the person you are with.",
                "Someone approaches.",
                "A voice is heard.",
                "You receive a text message with a photo."
                ],
        },
        // The event system for the player.
        // This is used to add random events to the player.
        // They can be used to add flavor to the game and are for things that change randomly.
        // They can be customized the same as game level event systems.
        // Use this to track changes in player.
        // Could be used to track player mood, powers or other changes that occur over time.
        // They can be cyclic or random. Cyclic events are in sequence and random events are chosen randomly.
        eventSystem: [],
        // The resources for the player.
        resources: [
            {
                // The type of resource.
                type: "health",
                // Is the resource increasing or decreasing naturally over time?
                isIncreased: false,
                // The current value of the resource.
                value: 10,
                // The maximum value of the resource.
                max: 10,
                // The minimum value of the resource.
                min: 0,
                // The rate of change for the resource.
                rate: 1,
                // Is the resource critical?
                isCritical: true,
                // Is the resource consumable?
                isConsumable: false,
                // Is the resource renewable?
                isRenewable: true,
                // The thresholds for the resource.
                // Thresholds are used to track the state of the resource.
                // For example, health might have thresholds for critical, injured, and good health.
                // The thresholds are used to track the state of the resource.
                // The message is displayed when the resource reaches the threshold and is added to the player status.
                // The thresholds are checked in order from top to bottom.
                // The threshold number should be between the min and max values of the resource.
                thresholds: [
                    { threshold: 0, message: "dead" },
                    { threshold: 3, message: "critically injured" },
                    { threshold: 5, message: "injured" },
                    { threshold: 7, message: "slightly injured" },
                    { threshold: Infinity, message: "in good health" },
                ],
            },
        ],
    };

    const defaultGame = {
        // Enable dynamically added actions.
        dynamicActions: false,
        // The action rate configuration.
        actionRate: defaultActionRate,
        // Enable the reputation system.
        enableReputationSystem: true,
        // Enable the charisma check.
        enableSayCharismaCheck: true,
        // The event system for the game.
        // This is used to add random events to the game.
        // They can be used to add flavor to the game and are for things that change randomly.
        // They can be customized the same as player level event systems.
        // Use this to track changes in the game.
        // Could be used to track weather, time of day, or other changes that occur over time.
        // They can be cyclic or random. Cyclic events are in sequence and random events are chosen randomly.
        eventSystem: [
            {
                // The name of the event system.
                name: "Natural Weather",
                // The events within the event system.
                // Add as many as you like but keep one in the array.
                // The system randomly selects one of the events for the event system if isRandom is true.
                // Else the system goes in order from bottom to top.
                // The chance is a fraction of a whole number.
                // The description is the text that is displayed when the event occurs.
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
        // Enable the event systems.
        eventSystemEnabled: true,
        // The default author's note for the game.
        authorsNote: "Style Keywords: Light, breezy, punchy, whimsical, comedic. Structure Keywords: Rapid, dynamic, action - packed, lively interactions, visual. Tone Keywords: Light, humorous, playful, fun, engaging, entertaining.",
        // The players in the game.
        players: [defaultPlayerYou],
        // Enable dynamically added players.
        isDynamicPlayersEnabled: true,
        // The resources in the game.
        // This is dynamic and can have any custom resources.
        // The resources are used to track the state of the outside world.
        resources: [],
        // Enable player messages.
        // This is used to display messages to the player.
        // This is disabled by default due to a bug in the UI.
        enablePlayerMessage: false,
        // The messages for the game.
        messages: []
    };
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++
    // END EDIT SECTION
    // ++++++++++++++++++++++++
    // ++++++++++++++++++++++++

    // The Oracle of Delphi is a game engine that adds a new level of depth to AI Dungeon.
    // DO NOT CHANGE ANYTHING BELOW THIS LINE!
    const oracle = () => {
        const getPlayerByName = name => {
            if (game.isDynamicPlayersEnabled && name !== "" && name !== null) {
                let player = game.players.find(p => p.name === name);
                if (!player) {

                    player = new Player(defaultPlayerYou);
                    player.name = name;
                    game.players.push(player); // Add the new player to the players array
                }
                return player;
            }
            return game.players.find(p => p.name === name) || game.players[0];
        }

        const getActionByName = name => {
            if (game.dynamicActions && name !== "default" && name !== "charisma" && name !== "") {
                let action = activePlayer.actions.find(a => a.name.includes(name.toLowerCase()));
                if (!action) {
                    // If skill does not exist, create it with default attributes.
                    let names = [];
                    names.push(name.toLowerCase());
                    activePlayerName = name;
                    action = new Action(names);
                    activePlayer.actions.push(action); // Add the new action to the actions array
                }
                return action;
            }
            return activePlayer.actions.find(a => a.name.includes(name.toLowerCase())) || activePlayer.actions[0];
        }

        /**
         * Determine success or failure of a action
         * @param {Action} action The action to check.
         * @returns {boolean} The success or failure of the action check.
         */
        const determineFate = (action) => {
            //Check if the action is disabled
            if (Object.values(action.preventAction).includes(true) || Object.values(activePlayer).includes(true)) {
                return false;
            }
            const success = Math.random() < action.rate;
            const message = success ? `${action.name[0]} check succeeded.` : `${action.name[0]} check failed.`
            game.messages = [message];
            return success;
        }

        const delphicBase = () => {
            // Set the default game state
            if (!state.game) {
                state.game = new Game(defaultGame);
            }
            // Ensure state.memory.authorsNote is blank and ready.
            state.memory.authorsNote = "";
            // Ensure state.memory.frontMemory is blank and ready.
            state.memory.frontMemory = "";
        }

        delphicBase(false);

        const game = new Game(state.game);

        const actionMatch = text.match(/> (.*) ((?:try|tries|attempt|attempts) (?:to use (.*) to |to )|(?:say|says) ("(?:[^"]+)"))/i);

        let activePlayerName = actionMatch ? actionMatch[1] : null;
        const isDoAction = actionMatch ? actionMatch[3] || (!actionMatch[4] && actionMatch) : null;
        const isSpeechAction = actionMatch ? actionMatch[4] !== undefined : null;

        const activePlayer = getPlayerByName(activePlayerName);


        //++++++++++++++++++++++++
        //++++++++++++++++++++++++
        // START MODULE PROCESSING
        //++++++++++++++++++++++++
        //++++++++++++++++++++++++


        //Please note: all these functions must pass arguments in order. If a function doesn't need a parameter, it will simply be ignored when the function is called.
        //This moduleProcessing function is only for testing purposes, and will be replaced with an array.
        //Arguments go as: (isActiveTurn, action, isSuccess)
        //All processing functions must account for a case where (action === undefined)

        /**
         * Array for modules that aren't sensitive to the order of processing
         */
        let moduleProcessingGeneral = [];

        /**
         * Array for modules that must be called after the general processing is complete
         */
        let moduleProcessingLast = [];

        // ++++++++++++++++++++++++++++++++++++++++
        // Default Modules (WARNING DO NOT TOUCH)
        // ++++++++++++++++++++++++++++++++++++++++


        // ++++++++++++++++++++++++++++++++++++++++
        // Player Activity
        // ++++++++++++++++++++++++++++++++++++++++

        /**
         * Logic for handling the player exhaustion.
         * @param {Boolean} active If the player turn is an active one.
         */
        const processPlayerActivity = (isActiveTurn) => {
            if (isActiveTurn) {
                activePlayer.exhaustion.inactive = 0;
                activePlayer.exhaustion.active = checkWithinBounds(activePlayer.exhaustion.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.inactive = checkWithinBounds(activePlayer.threat.inactive - 1, 0, Number.MAX_SAFE_INTEGER);
            } else {
                activePlayer.exhaustion.active = 0;
                activePlayer.exhaustion.inactive = checkWithinBounds(activePlayer.exhaustion.inactive + 1, 0, Number.MAX_SAFE_INTEGER);
                activePlayer.threat.active = checkWithinBounds(activePlayer.threat.active - 1, 0, Number.MAX_SAFE_INTEGER);
            }
        }

        if (activePlayer.exhaustion.enabled) {
            moduleProcessingGeneral.push(processPlayerActivity);
        }

        // ++++++++++++++++++++++++++++++++++++++++
        // Action Cooldown
        // ++++++++++++++++++++++++++++++++++++++++


        /**
         * Process all the actions providing an update to each non active action.
         * @param {Boolean} isActiveTurn If the turn is active
         * @param {Action} action The action being used actively
         */
        const processActionsCoolDown = (isActiveTurn, activeAction, isSuccess) => {
            game.players.filter(p => p.name !== activePlayerName).map(p => p.actions.forEach(a => a.coolDown.decrease()));
            //If an action was supplied
            if (activeAction) {

                //Increase the fail count
                if (!isSuccess) {
                    activeAction.coolDown.increase();
                }
            }

            //If an action was not supplied
            else {
                activePlayer.actions.forEach(currentAction => {
                    if (currentAction.coolDown.failureCount > 0) {
                        currentAction.coolDown.decrease();
                    }
                });
            }

            activePlayer.actions.forEach(currentAction => {
                if (currentAction.coolDown.remainingTurns > 0) {
                    currentAction.preventAction.cooldownToggle = true;
                }
                else {
                    currentAction.preventAction.cooldownToggle = false;
                }
            });
        }

        //Toggle for Action Cooldown module
        if (true) {


            moduleProcessingGeneral.push(processActionsCoolDown);

            //Initialize cooldown toggle for preventing actions. I play to make a class for modules with functions to handle this.
            state.game.players.forEach(p => p.actions.forEach(currentAction => {
                if (!currentAction.preventAction.cooldownToggle) {
                    currentAction.preventAction.cooldownToggle = false;
                }
            }));
        }

        // ++++++++++++++++++++++++++++++++++++++++
        // Player Reputation
        // ++++++++++++++++++++++++++++++++++++++++

        const processReputation = (isActiveTurn, action, isSuccess) => {
            if (action) {
                if (isSuccess && game.enableReputationSystem && (Math.random() < action.memorable)) {
                    activePlayer.actionHistory.push(new ActionHistory(action.name[0], info.actionCount));
                    activePlayer.actionHistory = activePlayer.actionHistory.filter(ah => ah.actionCount > Math.max(0, info.actionCount - 50))
                }
            }
        }

        //moduleProcessingGeneral.push(processReputation);

        // ++++++++++++++++++++++++++++++++++++++++
        // Update Player Resources
        // ++++++++++++++++++++++++++++++++++++++++

        const setPlayerResources = (isActiveTurn, action, isSuccess) => {
            if (action) {
                activePlayer.setResources(action, isSuccess);
            }
        }

        moduleProcessingLast.push(setPlayerResources);

        // ++++++++++++++++++++++++++++++++++++++++
        // Update Player Actions
        // ++++++++++++++++++++++++++++++++++++++++

        const updatePlayerActions = (isActiveTurn, action, isSuccess) => {
            if (action) {
                activePlayer.updateActions(action.name[0], isSuccess);
            }
        }

        moduleProcessingLast.push(updatePlayerActions);

        // ++++++++++++++++++++++++++++++++++++++++
        // End Default Modules (WARNING DO NOT TOUCH)
        // ++++++++++++++++++++++++++++++++++++++++

        // ++++++++++++++++++++++++++++++++++++++++
        // ++++++++++++++++++++++++++++++++++++++++
        // END MODULE PROCESSING
        // ++++++++++++++++++++++++++++++++++++++++
        // ++++++++++++++++++++++++++++++++++++++++

        /**
         * Handles the processing for game modules.
         * @param {Boolean} isActiveTurn If the turn is active.
         * @param {Action} action The action being used actively.
         * @param {Boolean} isSuccess If the action was a success.
         */
        const callModuleProcessing = (isActiveTurn, action, isSuccess) => {
            moduleProcessingGeneral.forEach(currentFunction => { currentFunction.apply(null, [isActiveTurn, action, isSuccess]) });
            moduleProcessingLast.forEach(currentFunction => { currentFunction.apply(null, [isActiveTurn, action, isSuccess]) });
        }

        /**
         * The action command parse for use as command parse and entry point.
         * @param {String} text The user imputed text.
         */
        const actionParse = () => {
            let isActiveTurn;
            if (isDoAction && !isSpeechAction) {
                const action = getActionByName((actionMatch[3] || "default"));
                isActiveTurn = true;
                const isSuccess = determineFate(action);
                callModuleProcessing(isActiveTurn, action, isSuccess);
                return action.getPhrase(isSuccess, activePlayerName);
            } else if (isSpeechAction && game.enableSayCharismaCheck) {
                // If speech is captured
                const action = getActionByName("charisma");
                isActiveTurn = false;
                const isSuccess = determineFate(action);
                callModuleProcessing(isActiveTurn, action, isSuccess);
                return action.getPhrase(isSuccess, activePlayerName);
            } else {
                isActiveTurn = false;
                callModuleProcessing(isActiveTurn);
                return "";  // No relevant action found
            }
        }

        /**
         * Get a random item from an array.
         * @returns The event system.
         */
        const getEventSystem = () => {
            if (game.eventSystemEnabled) {
                return game.eventSystem.map(e => e.description);
            }
            return [];
        }

        /**
         * Get a random item from the player threat array.
         * @returns The random item from the active players threat array.
         */
        const suddenly = () => {
            //console.log(`Threat Enabled: ${activePlayer.threat.enabled}, Inactive: ${activePlayer.threat.inactive}, Threshold: ${activePlayer.threat.threshold}`);
            if (!activePlayer.threat.enabled && !(activePlayer.threat.inactive > activePlayer.threat.threshold)) return "";
            
            // Update the threat array with any new items from the default threat array
            updateThreatArray(activePlayer, defaultPlayerYou);

            return getRandomItem(activePlayer.threat.array);
        }

        /**
         * Gets the players status.
         * @returns The status.
         */
        const getPlayersStatus = () => {
            const status = [...game.players.map(p => p.getStatus())].filter(e => e !== "");
            return status;
        }

        /**
         * Get the resource thresholds.
         * @returns The resource thresholds.
         */
        const getResourceThresholds = () => {
            let thresholds = [];
            game.resources.forEach(r => {
                let lastThresholdMessage = null;
                r.thresholds.forEach(t => {
                    if (r.value >= t.threshold) {
                        lastThresholdMessage = t.message;
                    }
                });
                if (lastThresholdMessage !== null) {
                    thresholds.push(lastThresholdMessage);
                }
            });
            return thresholds;
        }

        // Call and modify the front Memory so the information is only exposed to the AI for a single turn.
        game.eventSystem.forEach(e => e.changeEvent(Math.random()));
        state.memory.frontMemory = actionParse();

        state.memory.authorsNote = [
            ...getPlayersStatus(),
            suddenly(),
            ...getEventSystem(),
            ...getResourceThresholds(),
            game.authorsNote,
        ].filter(e = e => e !== "").join(" ").trim();

        // Notify the player of the status.
        if (game.enablePlayerMessage) {
            // This is not enabled yet as the message system is not fully implemented on AI Dungeon.
            // state.message = "";
            game.messages = [];
        }
        state.game = game;
    }
    oracle();
    return { text }
}

// Don't modify this part
modifier(text)