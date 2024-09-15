const { commandStart, getCommand, getWho, parseCommands, getModuleCommands } = require('./get.module.commands')

describe('Oracle Lite Input Tests', () => {
    test('commandStart should return the correct command start string', () => {
        const who = 'You'
        const module = 'try'
        const expected = '\n> You /'
        expect(commandStart(who, module)).toBe(expected)
    })

    test('getCommand should return the command part of the input', () => {
        const input = '\n> You /try /to jump over the fence.\n'
        const who = 'You'
        const expected = '/try /to jump over the fence'
        expect(getCommand(input, who)).toBe(expected)
    })

    test('getCommand should return null if input does not start with commandStart', () => {
        const input = '\n> Someone /try /to jump over the fence.\n'
        const who = 'You'
        expect(getCommand(input, who)).toBeNull()
    })

    test('parseCommands should return the command part of the input', () => {
        const input = '/try /to jump over the fence'
        const expected = {
            module: 'try',
            args: [
                { key: 'to', value: 'jump over the fence' }
            ]
        }
        const commandNames = ['roll', 'rolled', 'target']
        expect(parseCommands(input, commandNames)).toStrictEqual(expected)
    })

    test('parseCommands should return null if input does not start with commandStart', () => {
        const input = '/test'
        const commandNames = ['roll', 'rolled', 'target']
        expect(parseCommands(input, commandNames)).toBeNull()
    })

    test('getWho should return the correct name from the input', () => {
        const characters = ['John', 'Jane']
        const input = '\n> You /test command.\n'
        const expected = 'You'
        expect(getWho(input, characters)).toBe(expected)
    })

    test('getWho should return null if no valid name is found', () => {
        const characters = ['John', 'Jane']
        const input = '\n> Unknown /test command.\n'
        expect(getWho(input, characters)).toBeNull()
    })

    test('getModuleCommands should return null if no valid name is found', () => {
        const input = '\n> Unknown /test command.\n'
        expect(getModuleCommands(input)).toBeNull()
    })

    test('getModuleCommands should return null if no valid command is found', () => {
        const input = '\n> You test command.\n'
        expect(getModuleCommands(input)).toBeNull()
    })

    test('getModuleCommands should return parsed command if valid input is provided', () => {
        const input = '\n> You /try /to throw a ball.\n'
        const commandNames = ['roll', 'rolled', 'target']
        const expected = {
            who: 'You',
            commands: {
                module: 'try',
                args: [
                    { key: 'to', value: 'throw a ball' }
                ]
            }
        }
        expect(getModuleCommands(input, commandNames)).toStrictEqual(expected)
    })
})
