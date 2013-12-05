var repl = require('repl')
var fs = require('fs')
var path = require('path')
var findRoot = require('find-root')
var camelize = require('camelize')

function isDirectory(path) {
  return fs.statSync(path).isDirectory()
}


function scratchy (from) {
  var root = findRoot(from)
  var dir = path.basename(root)

  var modulesDir = path.join(root, 'node_modules')
  var modules = fs.readdirSync(modulesDir)
    .filter(function (item) {
      return item[0] !== '.' &&
        isDirectory(path.join(modulesDir, item))
    })

  var message = 'loaded modules: '
  message += modules.map(function (module) {
    if (/[\.-]/.test(module)) {
      return module + ' (as ' + camelize(module) +')'
    }
    return module
  }).join(', ')

  console.log(message)

  var r = repl.start({
    prompt: dir +'> '
  })

  modules.forEach(function (moduleName) {
    r.context[camelize(moduleName)] = require(path.join(modulesDir, moduleName))
  })

  return r
}

module.exports = scratchy