import { joinPath } from '../src/util'
describe('util', () => {
  describe('joinPath', () => {
    test('it should return an empty string on empty string input', () => {
      expect(joinPath('')).toHaveLength(0)
    })
    test('it should return an empty string on no args', () => {
      expect(joinPath()).toHaveLength(0)
    })

    test('it should return an input if only string s', () => {
      const input = 's'
      expect(joinPath(input)).toEqual(input)
    })
    test('it should return an input if only string /s', () => {
      const input = '/s'
      expect(joinPath(input)).toEqual(input)
    })
    test('it should return an input if only string s/', () => {
      const input = 's/'
      expect(joinPath(input)).toEqual(input)
    })

    test('it should return an a/b for a, b', () => {
      const input = ['a', 'b']
      expect(joinPath(...input)).toEqual('a/b')
    })
    test('it should return an /a/b for /a, b', () => {
      const input = ['/a', 'b']
      expect(joinPath(...input)).toEqual('/a/b')
    })
    test('it should return an a/b for a, /b', () => {
      const input = ['a', '/b']
      expect(joinPath(...input)).toEqual('a/b')
    })
    test('it should return an /a/b for /a, /b', () => {
      const input = ['/a', '/b']
      expect(joinPath(...input)).toEqual('/a/b')
    })
    test('it should return an /a/b for /a/, /b', () => {
      const input = ['/a/', '/b']
      expect(joinPath(...input)).toEqual('/a/b')
    })
    test('it should return an a/b/ for a, b/', () => {
      const input = ['a', 'b/']
      expect(joinPath(...input)).toEqual('a/b/')
    })
    test('it should return an a/b/ for a/, /b/', () => {
      const input = ['a/', '/b/']
      expect(joinPath(...input)).toEqual('a/b/')
    })
    test('it should return an a/b/ for a/, b/', () => {
      const input = ['a/', 'b/']
      expect(joinPath(...input)).toEqual('a/b/')
    })
  })
})
