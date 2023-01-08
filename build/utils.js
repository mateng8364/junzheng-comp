const path = require('path')
const fs = require('fs')
const join = path.join
const resolve = dir => path.join(__dirname, '../', dir)

function getComponentsEntries (path) {
  const files = fs.readdirSync(resolve(path))
  const componentsEntries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'))
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(`${itemPath}`)
    }
    return ret
  }, {})
  return componentsEntries
}
// getComponentsEntries('packages')

module.exports = {
  resolve,
  getComponentsEntries
}
