const camelCase = require('lodash.camelcase')
const kebabCase = require('lodash.kebabcase')

function normalizeOpts (opts) {
  opts = opts || {}
  opts.extention = opts.extention || '.js'
  return opts
}

function stripBase (file, opts) {
  const fname = file.replace(opts.baseDir, '')
  return fname
}

const funcs = {
  camelCase: function (file, opts) {
    opts = normalizeOpts(opts)
    let fname = stripBase(file, opts)
    fname = fname.replace(opts.extention, '')
    return camelCase(fname)
  },
  kebabCase: function (file, opts) {
    opts = normalizeOpts(opts)
    let fname = stripBase(file, opts)
    fname = fname.replace(opts.extention, '').replace(/\//g, ' ')
    const parts = kebabCase(fname).split('-')
    const newParts = []
    parts.forEach((p, i) => {
      if (parts[i + 1] && !isNaN(parts[i + 1])) {
        newParts.push(p + parts[i + 1])
      } else if (isNaN(p)) {
        newParts.push(p)
      }
    })
    return newParts.join('-')
  },
  tokenize: function (file, opts) {
    opts = normalizeOpts(opts)
    opts.token = opts.token || ','
    return funcs.kebabCase(file, opts).replace(/-/g, opts.token)
  },
  snakeCase: function (file, opts) {
    opts = normalizeOpts(opts)
    opts.token = '_'
    return funcs.tokenize(file, opts)
  },
  titleize: function (file, opts) {
    opts = normalizeOpts(opts)
    const result = funcs.camelCase(file, opts)
    const first = result.substr(0, 1).toUpperCase()
    return first + result.substr(1)
  }
}

module.exports = funcs
