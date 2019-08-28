/* eslint-env jest */
const defKeyBuilder = require('./def-key-builder')

describe('tokenize', () => {
  test('Without base dir', () => {
    const key = defKeyBuilder.tokenize('/base/path/to/file')
    expect(key).toBe('base,path,to,file')
  })

  test('With base dir', () => {
    const key = defKeyBuilder.tokenize('/base/path/to/file', { baseDir: '/base/path' })
    expect(key).toBe('to,file')
  })

  test('With custom token', () => {
    const key = defKeyBuilder.tokenize('/base/path/to/file', { token: '*' })
    expect(key).toBe('base*path*to*file')
  })
})

describe('Misc.', () => {
  test('camelCase', () => {
    const key = defKeyBuilder.camelCase('/base/path/to/file')
    expect(key).toBe('basePathToFile')
  })

  test('kebabCase', () => {
    const key = defKeyBuilder.kebabCase('/base/path/to/file')
    expect(key).toBe('base-path-to-file')
  })

  test('snakeCase', () => {
    const key = defKeyBuilder.snakeCase('/base/path/to/file')
    expect(key).toBe('base_path_to_file')
  })

  test('titleize', () => {
    const key = defKeyBuilder.titleize('/base/path/to/file')
    expect(key).toBe('BasePathToFile')
  })
})
