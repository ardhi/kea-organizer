/* eslint-env jest */
const helper = require('./helper')
const defKeyBuilder = require('./def-key-builder')
const config = require('./tests/data/config')
const dir = './tests/data/dummies'
const without = require('lodash.without')
const customResult = require('./tests/data/dummies/folder2/custom.js')

describe('Helpers', () => {
  describe('getFilesAndKeyBuilder', () => {
    test('Should skip all "_*.js"', () => {
      const [files] = helper.getFilesAndKeyBuilder({ baseDir: dir })
      let hasFile = false
      files.forEach(f => {
        if (f.indexOf('/_') > -1) hasFile = true
      })
      expect(hasFile).toBe(false)
    })

    test('Should skip all files with custom prefix"', () => {
      const [files] = helper.getFilesAndKeyBuilder({ baseDir: dir, skipSuffix: 'mod' })
      let hasFile = false
      files.forEach(f => {
        if (f.indexOf('/mod') > -1) hasFile = true
      })
      expect(hasFile).toBe(false)
    })

    test('Should include all valid files and default key builder', () => {
      const [files, keyBuilder] = helper.getFilesAndKeyBuilder({ baseDir: dir })
      expect(keyBuilder).toBe(defKeyBuilder.camelCase)
      expect(files).toHaveLength(config.expectedFiles.length)
      expect(files.sort()).toEqual(config.expectedFiles.sort())
    })

    test('should use tokenize as the key builder', () => {
      const h = helper.getFilesAndKeyBuilder({ baseDir: dir, keyBuilder: 'tokenize' })
      expect(h[1]).toBe(defKeyBuilder.tokenize)
    })

    test('should use default key builder if no key founds', () => {
      const h = helper.getFilesAndKeyBuilder({ baseDir: dir, keyBuilder: 'nonexistent' })
      expect(h[1]).toBe(defKeyBuilder.camelCase)
    })

    test('should simply use as custom key builder if a function is passed', () => {
      const fn = function (file, opts) {}
      const h = helper.getFilesAndKeyBuilder({ baseDir: dir, keyBuilder: fn })
      expect(h[1]).toBe(fn)
    })
  })

  describe('createPair', () => {
    test('should return custom key and value', () => {
      const expected = customResult._value
      const keyBuilder = defKeyBuilder.camelCase
      const [key, val] = helper.createPair('./tests/data/dummies/folder2/custom.js', keyBuilder, { baseDir: dir })
      expect(key).toBe('customkey')
      expect(val).toBe(expected)
    })

    test('should ignore custom key if no value provided', () => {
      const keyBuilder = defKeyBuilder.camelCase
      const [key, val] = helper.createPair('./tests/data/dummies/folder2/invalidcustom.js', keyBuilder, { baseDir: dir })
      expect(key).toBe('folder2Invalidcustom')
      expect(val).toBe(require('./tests/data/dummies/folder2/invalidcustom.js'))
    })
  })

  describe('buildFlat', () => {
    test('should return default object', () => {
      const opts = { baseDir: dir }
      const result = helper.buildFlat(opts)
      const keys = []
      without(config.expectedFiles, './tests/data/dummies/folder2/custom.js').forEach(f => {
        keys.push(defKeyBuilder.camelCase(f, opts))
      })
      keys.push(customResult._key)
      expect(Object.keys(result).sort()).toEqual(keys.sort())
      expect(result.mod1).toBe(require(`${dir}/mod1`))
      expect(result.folder1Const1).toBe(require(`${dir}/folder1/const1`))
    })

    test('should return object with custom key builder', () => {
      const opts = { baseDir: dir, keyBuilder: function (file, opts) { return file } }
      const result = helper.buildFlat(opts)
      const expected = without(config.expectedFiles, './tests/data/dummies/folder2/custom.js')
      expected.push('customkey')
      expect(Object.keys(result).sort()).toEqual(expected.sort())
      expect(result[`${dir}/mod1.js`]).toBe(require(`${dir}/mod1`))
      expect(result[`${dir}/folder1/const1.js`]).toBe(require(`${dir}/folder1/const1`))
    })
  })

  describe('buildTree', () => {
    test('should return an object tree', () => {
      const opts = { baseDir: dir }
      const result = helper.buildTree(opts)
      const expected = config.expectedTree
      delete expected.folder2.custom
      expected[customResult._key] = customResult._value
      expect(result).toEqual(expected)
    })
  })
})
