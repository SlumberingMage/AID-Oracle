const replaceNames = require('./replace.names')

const getNames = () => {
  function buildUnionArray (names) {
    function buildByTags (tags, names) {
      return names.filter(item => {
        return tags.every(tag => item.tags.includes(tag))
      }).map(item => item.name)
    }
    return names.map(item => {
      if (item.name) {
        return item
      } else if (item.union) {
        return { ...item, name: buildByTags(item.tags, names) }
      }
      return null
    })
  }
  return {
    toReplace: [
      {
        name: 'Alice',
        tags: ['human', 'female']
      },
      {
        name: 'Elara',
        tags: ['elf', 'half-elf', 'human', 'female']
      }
    ],
    replaceWith: buildUnionArray([
      {
        name: 'Siri',
        tags: ['female', 'human']
      },
      {
        name: 'Arwen',
        tags: ['elf', 'female']
      },
      {
        name: 'Legless',
        tags: ['elf', 'male']
      },
      {
        name: 'John',
        tags: ['human', 'male']
      },
      {
        name: 'Alex',
        tags: ['human']
      },
      {
        name: 'Pat',
        tags: ['human']
      },
      {
        name: 'Bob',
        tags: ['human', 'male']
      },
      {
        name: 'Jane',
        tags: ['human', 'female']
      },
      {
        name: 'Mike',
        tags: ['human', 'male']
      },
      {
        name: 'Sarah',
        tags: ['human', 'female']
      },
      {
        union: ['human', 'female', 'elf'],
        tags: ['female', 'half-elf']
      },
      {
        union: ['human', 'male', 'elf'],
        tags: ['male', 'half-elf']
      }
    ])
  }
}
const names = getNames()

describe('replaceNames', () => {
  test('Test the text is changed when the name Elara is present', () => {
    const text = 'Elara is a wizard and has a pet dragon named Smaug. Elara sometimes goes on adventures with her friends, such as a knight named Sir Lancelot and a bard named Galadriel.'
    expect(replaceNames(text, names)).not.toBe(text)
  })
  test('Test the text is not changed.', () => {
    const text = 'John is a wizard and has a pet dragon named Smaug. John sometimes goes on adventures with her friends, such as a knight named Sir Lancelot and a bard named Galadriel.'
    expect(replaceNames(text, names)).toBe(text)
  })
})
