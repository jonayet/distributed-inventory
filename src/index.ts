const moduleAlias = require('module-alias')

// register virtual modules
moduleAlias.addAliases({
  '@platform': __dirname + '/platform',
  '@inventory': __dirname + '/inventory'
})

import '@inventory/app'