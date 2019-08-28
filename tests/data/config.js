module.exports = {
  expectedFiles: [
    './tests/data/dummies/mod1.js',
    './tests/data/dummies/folder1/const1.js',
    './tests/data/dummies/mod2.js',
    './tests/data/dummies/folder2/mod1.js',
    './tests/data/dummies/folder1/const2.js',
    './tests/data/dummies/folder2/mod2.js',
    './tests/data/dummies/folder2/custom.js',
    './tests/data/dummies/folder2/invalidcustom.js',
    './tests/data/dummies/folder1/sub1/mod1.js',
    './tests/data/dummies/folder1/sub1/mod2.js'
  ],
  expectedTree: {
    mod1: require('./dummies/mod1.js'),
    mod2: require('./dummies/mod2.js'),
    folder1: {
      const1: require('./dummies/folder1/const1.js'),
      const2: require('./dummies/folder1/const2.js'),
      sub1: {
        mod1: require('./dummies/folder1/sub1/mod1.js'),
        mod2: require('./dummies/folder1/sub1/mod2.js')
      }
    },
    folder2: {
      mod1: require('./dummies/folder2/mod1.js'),
      mod2: require('./dummies/folder2/mod2.js'),
      custom: require('./dummies/folder2/custom.js')['_value'],
      invalidcustom: require('./dummies/folder2/invalidcustom.js')
    }
  }
}
