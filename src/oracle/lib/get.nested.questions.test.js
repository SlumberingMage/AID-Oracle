const { buildQuestionString } = require('./get.nested.questions');
describe('Testing get.nested.questions', () => {
    test('Test one action.', () => {
        // Randomize question order for topological sorting verification.
        const input = [
            { 'description': '$player $player_pet' },
            { 'player_name': 'character.name' },
            { 'player_gender': 'What is $player_name\'s gender?' },
            { 'player_why': 'Why did $player_name work alone?' },
            { 'player': '$player_name is a $player_gender, who worked in in secret because they believed $player_why.' },
            { 'pet_kind': 'What kind of pet does $player_name have?' },
            { 'pet_name': 'What is $player_name\'s $pet_kind\'s name?' },
            { 'pet_gender': 'What gender is pet_name?' },
            { 'player_pet': '$player_name has a $pet_name is a $pet_gender $pet_kind with a rambunctious attitude and friendly demander.' },
        ].map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        // Expected output in random order.
        const randomOutput = [
            { 'key': 'player_name', 'value': '${character.name}'},
            { 'key': 'player_gender', 'value': '${What is ${character.name}\'s gender?}'},
            { 'key': 'player_why', 'value': '${Why did ${character.name} work alone?}'},
            { 'key': 'player', 'value': '${${character.name} is a ${What is ${character.name}\'s gender?}, who worked in in secret because they believed ${Why did ${character.name} work alone?}.}'},
            { 'key': 'pet_kind', 'value': '${What kind of pet does ${character.name} have?}'},
            { 'key': 'pet_name', 'value': '${What is ${character.name}\'s ${What kind of pet does ${character.name} have?}\'s name?}'},
            { 'key': 'pet_gender', 'value': '${What gender is pet_name?}'},
            { 'key': 'player_pet', 'value': '${${character.name} has a ${What is ${character.name}\'s ${What kind of pet does ${character.name} have?}\'s name?} is a ${What gender is pet_name?} ${What kind of pet does ${character.name} have?} with a rambunctious attitude and friendly demander.}'}
            ].map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        const expectedOutput = [{ 'key': 'description', 'value': '${${${character.name} is a ${What is ${character.name}\'s gender?}, who worked in in secret because they believed ${Why did ${character.name} work alone?}.} ${${character.name} has a ${What is ${character.name}\'s ${What kind of pet does ${character.name} have?}\'s name?} is a ${What gender is pet_name?} ${What kind of pet does ${character.name} have?} with a rambunctious attitude and friendly demander.}}' }, ...randomOutput];
        const questions = buildQuestionString(input);
        expect(questions[0].key).toEqual(expectedOutput[0].key);
        expect(questions[0].value).toEqual(expectedOutput[0].value);
        const keys = expectedOutput.map(o => o.key);
        const values = expectedOutput.map(o => o.value);

        questions.forEach(output => {
            expect(keys).toContain(output.key);
            expect(values).toContain(output.value);
        });
    });
});