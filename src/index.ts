import { join } from 'path'

const moduleAlias = require('module-alias')

// register virtual modules
moduleAlias.addAliases({
  '@platform': join(__dirname, '/platform'),
  '@inventory': join(__dirname, '/inventory')
})

require('@inventory/app')
