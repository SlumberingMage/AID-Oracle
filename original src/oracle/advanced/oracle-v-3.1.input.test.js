const { tester, getRandomItem, getNextItem, getCopular, checkWithinBounds, startingActionRate, Game, Player, Resource, Action, ActionHistory, EventSystem, Exhaustion, Threat, ActionRate, CoolDown, defaultGame, defaultPlayer, defaultResource, defaultAction, defaultActionHistory, defaultEventSystem, defaultExhaustion, defaultThreat, defaultActionRate, customActions } = require("./oracle-v-3.1.input");

const game = new Game(defaultGame);
const loops = 100;
const state = {
    memory: { context: "This is the memory", authorsNote: "This is the authors note" },
    game: new Game(defaultGame),
};
const history = [
    {
        text: "A first history line",
        type: "story",
        rawText: "A first history line"
    },
    {
        text: "A second history line",
        type: "story",
        rawText: "A second history line"
    }
];
const storyCards = [{ id: "1", keys: "exampleKey", entry: "exampleEntry", type: "exampleType" }];
const info = {
    actionCount: 1,
    characters: ["character1", "character2"]
};

test("Test Player Class", () => {
    expect(state.game.players[0].name).toBe("You");

    state.game.players[0].setResources(false, "fighting");
    expect(state.game.players[0].resources[0].value).toBe(7);
    expect(state.game.players[0].getResourceThresholds()).toStrictEqual(["slightly injured"]);

    state.game.players[0].setResources(true, "first-aid");
    expect(state.game.players[0].resources[0].value).toBe(10);
    expect(state.game.players[0].getResourceThresholds()).toStrictEqual(["in good health"]);
    expect(state.game.players[0].getStatus()).toBe("Your status: A skilled fighter. In good health.");

    for (let index = 0; index < 10; index++) {
        state.game.players[0].setResources(false, "fighting");
    }
    expect(state.game.players[0].getResourceThresholds()).toStrictEqual(["dead"]);
});

test("Test Action Class", () => {
    const action = state.game.players[0].actions[1];
    expect(action.name.includes("speech")).toBe(true);
    expect(action.rate).toBe(0.5);
});

test("Test CoolDown Class", () => {
    const coolDown = state.game.players[0].actions[1].coolDown;
    expect(coolDown.failureThreshold).toBe(3);
    coolDown.increase();
    coolDown.increase();
    expect(coolDown.failureCount).toBe(2);
    coolDown.decrease();
    expect(coolDown.failureCount).toBe(1);
    coolDown.increase();
    coolDown.increase();
    expect(coolDown.remainingTurns).toBe(3);
    expect(coolDown.failureCount).toBe(0);
});

test("Test Leveling Class", () => {
    const action = state.game.players[0].actions[1];
    expect(action.rate).toBe(.50);
    action.updateRate(true, true);
    expect(action.rate).toBe(.51);
    action.updateRate(false, false);
    expect(action.rate).toBe(0.5098333333333334);
    state.game.players[0].updateActions("charisma", true);
    expect(action.rate).toBe(0.5198333333333334);
});

test("Test getNextItem", () => {
    const arr = [1, 2, 3, 4, 5];
    const currentIndex = 2;
    const nextItem = getNextItem(arr, currentIndex);
    expect(nextItem).toBe(arr[currentIndex + 1]);
});

test("Test checkWithinBounds", () => {
    const number = 10;
    const lowerBound = 5;
    const upperBound = 15;
    const adjustedNumber = checkWithinBounds(number, lowerBound);
    expect(adjustedNumber).toBe(number);

    const number2 = 20;
    const adjustedNumber2 = checkWithinBounds(number2, lowerBound, upperBound);
    expect(adjustedNumber2).toBe(upperBound);
});

// test("Test getCopular", () => {
//     expect(getCopular("You")).toBe("are");
//     expect(getCopular("Bob")).toBe("is");
//     expect(getCopular("I")).toBe("am");
// });

const weatherMatch = /(It is thundering outside\.|There is a thick fog outside\.|It is clear outside\.|There are clouds outside\.|There are clouds and precipitation outside\.)/;
test("Test Change Event", () => {
    state.game.eventSystem.forEach(e => {
        e.changeEvent(.05);
        expect(e.description).toMatch(weatherMatch);
    });
});

const frontMemoryFightMatch = /(Success|Fail)! (You|Your) (attacked|attempt to attack) (with brutal efficiency!|with deadly precision!|with unyielding determination!|was sloppy.|was ineffective.|was reckless.)/;
const frontMemoryMoveMatch = /(Success|Fail)! Your( movement| attempt to move) (was graceful!|was fluid!|was agile!|was pitiful\.|was reckless\.|was awkward\.)/;
const frontMemorySpeechMatch = /(Success|Fail)! Your words were (persuasive|charming|full of conviction|awkward|unconvincing|ineffectual)\./;
const frontMemoryDefaultMatch = /(Success|Fail)! Your action (was masterful\.|was executed perfectly\.|couldn't have gone better!|was futile.|was clumsy.|was inept.)/;
test("Test Fighting action", () => {
    const text = "> You try to use fighting to defend yourself.";
    const results = tester(state, text, history, storyCards, info);
    expect(results.state).toMatchObject(state);
    expect(results.state.memory.frontMemory).toMatch(frontMemoryFightMatch);
    expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
    expect(results.text).toBe(text);
    expect(results.history).toMatchObject(history);
    expect(results.storyCards).toMatchObject(storyCards);
    expect(results.info).toMatchObject(info);
});

// Used for testing the random outcomes of the items tested.
for (let index = 0; index < loops; index++) {

    test("Test getRandomItem", () => {
        const arr = [1, 2, 3, 4, 5];
        const item = getRandomItem(arr);
        expect(arr.includes(item)).toBe(true);
    });

    test("Test startingActionRate", () => {
        const starting = 0.4;
        const min = 0.01;
        const max = 0.2;
        const actionRate = startingActionRate(starting, min, max);
        expect(actionRate).toBeLessThan(max + starting + 0.01);
        expect(actionRate).toBeGreaterThan(starting);
    });

    test("Test Fighting action", () => {
        const text = "> You try to use fighting to defend yourself.";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryFightMatch);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test default action", () => {
        const text = "> You try to move the rock.";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryDefaultMatch);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test speech action", () => {
        const text = "> You say \"Some words you say.\"";
        const results = tester(state, text, history, storyCards, info);
        expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemorySpeechMatch);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test move action", () => {
        const text = "> You try to use leap to get out of the way!";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryMoveMatch);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test speech action with new player", () => {
        const text = "> Bob says \"Some words you say.\"";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(/(Success!|Fail!) Bob's words were (persuasive|charming|full of conviction|awkward|unconvincing|ineffectual)\./);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });


    test("Test dynamic action", () => {
        const text = "> You try to use dragonfire to burn something.";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(frontMemoryDefaultMatch);
        if (results.state.game.enableDynamicActions) {
            expect(results.state.game.players[0].actions[8].name.includes("dragonfire")).toBe(true);
        }
        else {
            expect(results.state.game.players[0].actions[8]).toBe(undefined);
        }
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test none action", () => {
        const text = "I move the rock.";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch("");
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });

    test("Test module ", () => {
        const text = "> You try to test a module.\"";
        const results = tester(state, text, history, storyCards, info);
        //expect(results.state).toMatchObject(state);
        expect(results.state.memory.frontMemory).toMatch(/Success! Modified success start, original success ending./);
        expect(results.state.memory.authorsNote.includes(game.authorsNote)).toBe(true);
        expect(results.text).toBe(text);
        expect(results.history).toMatchObject(history);
        expect(results.storyCards).toMatchObject(storyCards);
        expect(results.info).toMatchObject(info);
    });
}