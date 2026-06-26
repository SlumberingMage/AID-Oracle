const formatOutput = require('./format.paragraph')

describe('formatOutput', () => {
    const historyWithLastStory = [
        {
            "text": "A first history line",
            "type": "story",
            "rawText": "A first history line"
        },
        {
            "text": "A second history line",
            "type": "story",
            "rawText": "A second history line"
        },
        {
            "text": "The last line of the history",
            "type": "story",
            "rawText": "The last line of the history."
        }
    ]

    const incorrectText = " With a newfound resolve, Siri turned and made her way back onto the main thoroughfare. The streets of Night City were a cacophony of life, a neon-soaked canvas where the painted lines between right and wrong were perpetually blurred. She moved with purpose, her senses heightened, the sound of distant gunfire and the throbbing bass of club music a reminder of the city's relentless pulse. \n\nSiri's thoughts were a whirlwind of gratitude and curiosity as she navigated the crowded streets. The encounter with Magnus had left an indelible mark on her, a story she would carry with her—a tale of the unkillable man who walked in shadows. But she knew better than to voice her thoughts aloud. Night City thrived on whispers and rumors, but it was also a place where the wrong words could get you killed.\n \nAs she walked, the image of Magnus disarming her attacker replayed in her mind's eye. His unnatural resilience, his precise movements, the way he had seemed almost to blend with the darkness itself—it was a sight she would never forget. It was also a secret she would take to her grave, for she understood the value of such a power in a city ruled by the ruthless and the greedy. As Siri wove her way through the bustling crowds, the gravity of her encounter with Magnus began to sink in. She could still feel the ghost of his grip on her arm, a gentle yet firm hold that had pulled her back from the brink of danger. She knew she owed him her life, a debt that weighed heavily on her conscience.\nThe neon lights cast long, flickering shadows across the cityscape, and Siri felt a chill run down her spine. She had always considered Night City to be a place of lurking dangers and hidden threats, but tonight, she had witnessed a different kind of power—one that operated beyond the scope of the city's gangs and corporations.\n\n She paused on a street corner, her eyes scanning the sea of faces that surrounded her. Each person carried their own secrets, their own stories of survival in this unforgiving metropolis. Siri's gaze lingered on the faces of passersby, each one a testament to the harsh realities of life in Night City. She saw the desperation, the hope, and the relentless drive to survive etched into their features. The city was a crucible, forging the weak into warriors and the strong into legends.\n\nAs she stood there, lost in thought, a group of street performers caught her attention."

    const correctText = "With a newfound resolve, Siri turned and made her way back onto the main thoroughfare. The streets of Night City were a cacophony of life, a neon-soaked canvas where the painted lines between right and wrong were perpetually blurred. She moved with purpose, her senses heightened, the sound of distant gunfire and the throbbing bass of club music a reminder of the city's relentless pulse.\n\nSiri's thoughts were a whirlwind of gratitude and curiosity as she navigated the crowded streets. The encounter with Magnus had left an indelible mark on her, a story she would carry with her—a tale of the unkillable man who walked in shadows. But she knew better than to voice her thoughts aloud. Night City thrived on whispers and rumors, but it was also a place where the wrong words could get you killed.\n\nAs she walked, the image of Magnus disarming her attacker replayed in her mind's eye. His unnatural resilience, his precise movements, the way he had seemed almost to blend with the darkness itself—it was a sight she would never forget. It was also a secret she would take to her grave, for she understood the value of such a power in a city ruled by the ruthless and the greedy. As Siri wove her way through the bustling crowds, the gravity of her encounter with Magnus began to sink in. She could still feel the ghost of his grip on her arm, a gentle yet firm hold that had pulled her back from the brink of danger. She knew she owed him her life, a debt that weighed heavily on her conscience.\n\nThe neon lights cast long, flickering shadows across the cityscape, and Siri felt a chill run down her spine. She had always considered Night City to be a place of lurking dangers and hidden threats, but tonight, she had witnessed a different kind of power—one that operated beyond the scope of the city's gangs and corporations.\n\nShe paused on a street corner, her eyes scanning the sea of faces that surrounded her. Each person carried their own secrets, their own stories of survival in this unforgiving metropolis. Siri's gaze lingered on the faces of passersby, each one a testament to the harsh realities of life in Night City. She saw the desperation, the hope, and the relentless drive to survive etched into their features. The city was a crucible, forging the weak into warriors and the strong into legends.\n\nAs she stood there, lost in thought, a group of street performers caught her attention."

    test('Verify text is formatted correctly', () => {
        expect(formatOutput(incorrectText, historyWithLastStory)).toBe(' ' + correctText)
    })

    test('Verify text is formatted correctly, and has not changed', () => {
        expect(formatOutput(' ' + correctText, historyWithLastStory)).toBe(' ' + correctText)
    })

    test('Verify text is formatted correctly', () => {
        expect(formatOutput(incorrectText, historyWithLastStory)).toBe(' ' + correctText)
    })

    test('Verify text is formatted correctly, and has not changed', () => {
        expect(formatOutput(' ' + correctText, historyWithLastStory)).toBe(' ' + correctText)
    })

    const historyWithLastDo = [
        {
            "text": "A first history line",
            "type": "story",
            "rawText": "A first history line"
        },
        {
            "text": "A second history line",
            "type": "story",
            "rawText": "A second history line"
        },
        {
            "text": "\n> You did a thing.\n",
            "type": "do",
            "rawText": "\n> You did a thing.\n"
        }
    ]

    test('Verify text is formatted correctly, last action do', () => {
        expect(formatOutput(incorrectText, historyWithLastDo)).toBe('\n'+correctText)
    })

    test('Verify text is formatted correctly, and has not changed, last action do', () => {
        expect(formatOutput('\n' + correctText, historyWithLastDo)).toBe('\n' + correctText)
    })

    test('Verify text is formatted correctly, last action do', () => {
        expect(formatOutput(incorrectText, historyWithLastDo)).toBe('\n' + correctText)
    })

    test('Verify text is formatted correctly, and has not changed, last action do', () => {
        expect(formatOutput('\n' + correctText, historyWithLastDo)).toBe('\n' + correctText)
    })
})