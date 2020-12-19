const lockDB: Record<string, string> = {}

export async function tryLock(lockId: string, refId: string) {
  if(lockDB[lockId] !== undefined) return false

  lockDB[lockId] = refId
  return true
}

export async function releaseLock(lockId: string, refId: string) {
  if(lockDB[lockId] === undefined) return Promise.reject(`Lock: '${lockId}' is invalid`)

  if(lockDB[lockId] !== refId) return Promise.reject(`Reference: '${refId}' is invalid`)

  delete lockDB[lockId]
}