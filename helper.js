const globby = require('globby')
const set = require('lodash.set')
const defKeyBuilder = require('./def-key-builder')

const funcs = {
  getFilesAndKeyBuilder: function (options) {
    options = options || {}
    options.skipSuffix = options.skipSuffix || '_'
    options.extention = options.extention || '.js'
    const files = globby.sync(`${options.baseDir}/**/*${options.extention}`, {
      ignore: [`${options.baseDir}/**/${options.skipSuffix}*`]
    })
    let keyBuilder = defKeyBuilder.camelCase
    if (typeof options.keyBuilder === 'function') {
      keyBuilder = options.keyBuilder
    } else if (Object.keys(defKeyBuilder).indexOf(options.keyBuilder) > -1) {
      keyBuilder = defKeyBuilder[options.keyBuilder]
    }
    return [files, keyBuilder]
  },
  createPair: function (file, keyBuilder, options) {
    let key = keyBuilder(file, options)
    let val = require(file)
    if (typeof val === 'object' && ![undefined, null].includes(val) && typeof val._key === 'string' && val._value) {
      key = val._key
      val = val._value
    }
    return [key, val]
  },
  buildFlat: function (options) {
    const result = {}
    const [files, keyBuilder] = funcs.getFilesAndKeyBuilder(options)

    files.forEach(f => {
      const [key, val] = funcs.createPair(f, keyBuilder, options)
      result[key] = val
    })

    return result
  },
  buildTree: function (options) {
    let result = {}
    options.keyBuilder = 'tokenize'
    options.token = '.'
    const [files, keyBuilder] = funcs.getFilesAndKeyBuilder(options)

    files.forEach(f => {
      const [key, val] = funcs.createPair(f, keyBuilder, options)
      result = set(result, key, val)
    })

    return result
  }
}

module.exports = funcs
