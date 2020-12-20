const { v4: uuidv4 } = require('uuid')

export function getUid () {
  return uuidv4() as string
}

export function getTime () {
  return Date.now()
}
