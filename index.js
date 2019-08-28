const helper = require('./helper')

module.exports = function (options) {
  if (typeof options === 'string') {
    options = {
      type: 'flatObject',
      baseDir: options
    }
  }
  options.type = options.type || 'flatObject'
  options.baseDir = options.baseDir || process.cwd()
  options.baseDir = options.baseDir.replace(/\\/g, '/')

  if (options.type === 'class') {
    return global[options.name]
  }

  return options.type === 'tree' ? helper.buildTree(options) : helper.buildFlat(options)
}
