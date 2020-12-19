import { getUid } from '../utils'

const lockDB: Record<string, string> = {}

export async function tryLock(lockId: string) {
  if(lockDB[lockId] !== undefined) return Promise.reject(`Lock: '${lockId}' is locked already.`)

  const refId = getUid()
  lockDB[lockId] = refId
  return refId
}

export async function releaseLock(lockId: string, refId: string) {
  if(lockDB[lockId] === undefined) return Promise.reject(`Lock: '${lockId}' is invalid`)

  if(lockDB[lockId] !== refId) return Promise.reject(`Reference: '${refId}' is invalid`)

  delete lockDB[lockId]
}

export async function isLocked(lockId: string) {
  return lockDB[lockId] !== undefined
}

export async function releaseAllLocks() {
  for (const lockId in lockDB) {
    if (lockDB.hasOwnProperty(lockId))
      delete lockDB[lockId]
  }
}