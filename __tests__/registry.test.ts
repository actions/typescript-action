import assert from 'assert'
import { updateRegistry } from '../src/registry'
describe('registry', () => {
  test('it should append the version on an non-existent registry', async () => {
    const storage = new MockStorage()

    await updateRegistry(
      async () => {
        return storage.get.bind(storage, 'index.json')()
      },
      async data => {
        return storage.set.bind(storage, 'index.json')(data)
      },
      {
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg'
      },
      {
        version: '1.0.0',
        url: 'https://example.com/catalog',
        changelog: [],
        dev: true
      }
    )

    const reg = storage.get('index.json')
    expect(reg).toBeDefined()
    assert(reg !== undefined)
    expect(JSON.parse(reg)).toEqual({
      name: 'example',
      description: 'something descriptive',
      logo: 'https://example.com/logo.jpg',
      versions: [
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: [],
          dev: true
        }
      ]
    })
  })
  test('it should append the version on an empty registry', async () => {
    const storage = new MockStorage()
    storage.set(
      'index.json',
      JSON.stringify({
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg'
      })
    )

    await updateRegistry(
      async () => {
        return storage.get.bind(storage, 'index.json')()
      },
      async data => {
        return storage.set.bind(storage, 'index.json')(data)
      },
      {
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg'
      },
      {
        version: '1.0.0',
        url: 'https://example.com/catalog',
        changelog: [],
        dev: true
      }
    )

    const reg = storage.get('index.json')
    expect(reg).toBeDefined()
    assert(reg !== undefined)
    expect(JSON.parse(reg)).toEqual({
      name: 'example',
      description: 'something descriptive',
      logo: 'https://example.com/logo.jpg',
      versions: [
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: [],
          dev: true
        }
      ]
    })
  })
  test('it should append the version on an non-empty registry', async () => {
    const storage = new MockStorage()
    storage.set(
      'index.json',
      JSON.stringify({
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg',
        versions: [
          {
            version: '0.0.1',
            url: 'https://example.com/catalog',
            changelog: [],
            dev: true
          }
        ]
      })
    )

    await updateRegistry(
      async () => {
        return storage.get.bind(storage, 'index.json')()
      },
      async data => {
        return storage.set.bind(storage, 'index.json')(data)
      },
      {
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg'
      },
      {
        version: '1.0.0',
        url: 'https://example.com/catalog',
        changelog: [],
        dev: false
      }
    )

    const reg = storage.get('index.json')
    expect(reg).toBeDefined()
    assert(reg !== undefined)
    expect(JSON.parse(reg)).toEqual({
      name: 'example',
      description: 'something descriptive',
      logo: 'https://example.com/logo.jpg',
      versions: [
        {
          version: '0.0.1',
          url: 'https://example.com/catalog',
          changelog: [],
          dev: true
        },
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: [],
          dev: false
        }
      ]
    })
  })
  test('it should replace an existing version on an non-empty registry', async () => {
    const storage = new MockStorage()
    storage.set(
      'index.json',
      JSON.stringify({
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg',
        versions: [
          {
            version: '1.0.0',
            url: 'https://example.com/catalog',
            changelog: [],
            dev: true
          }
        ]
      })
    )

    await updateRegistry(
      async () => {
        return storage.get.bind(storage, 'index.json')()
      },
      async data => {
        return storage.set.bind(storage, 'index.json')(data)
      },
      {
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg'
      },
      {
        version: '1.0.0',
        url: 'https://example.com/catalog',
        changelog: ['some missed docs'],
        dev: true
      }
    )

    const reg = storage.get('index.json')
    expect(reg).toBeDefined()
    assert(reg !== undefined)
    expect(JSON.parse(reg)).toEqual({
      name: 'example',
      description: 'something descriptive',
      logo: 'https://example.com/logo.jpg',
      versions: [
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: ['some missed docs'],
          dev: true
        }
      ]
    })
  })
  test('it should throw whent the get or set fails', async () => {
    const storage = new MockStorage()
    storage.set(
      'index.json',
      JSON.stringify({
        name: 'example',
        description: 'something descriptive',
        logo: 'https://example.com/logo.jpg',
        versions: [
          {
            version: '1.0.0',
            url: 'https://example.com/catalog',
            changelog: [],
            dev: true
          }
        ]
      })
    )

    await expect(async () =>
      updateRegistry(
        async () => {
          throw new Error('some network error')
        },
        async data => {
          return storage.set.bind(storage, 'index.json')(data)
        },
        {
          name: 'example',
          description: 'something descriptive',
          logo: 'https://example.com/logo.jpg'
        },
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: ['some missed docs'],
          dev: true
        }
      )
    ).rejects.toThrow()

    const reg = storage.get('index.json')
    expect(reg).toBeDefined()
    assert(reg !== undefined)
    expect(JSON.parse(reg)).toEqual({
      name: 'example',
      description: 'something descriptive',
      logo: 'https://example.com/logo.jpg',
      versions: [
        {
          version: '1.0.0',
          url: 'https://example.com/catalog',
          changelog: [],
          dev: true
        }
      ]
    })
  })
})

const VALUE = Symbol('value')
type InternalStorageTree = {
  [key: string]: InternalStorageTree
  [VALUE]?: string
}

class MockStorage {
  data: InternalStorageTree = {}

  get(path: string): string | undefined {
    const keys = path.split('/')

    let curr = this.data
    for (const k of keys) {
      if (k in curr) {
        curr = curr[k]
      } else {
        return undefined
      }
    }

    return curr[VALUE]
  }
  set(path: string, data: string): void {
    const keys = path.split('/')

    let curr = this.data
    for (const k of keys) {
      if (!(k in curr)) {
        curr[k] = {}
      }
      curr = curr[k]
    }

    curr[VALUE] = data
  }
}
