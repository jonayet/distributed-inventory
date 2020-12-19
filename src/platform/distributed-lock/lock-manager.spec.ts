import { tryLock, releaseLock, releaseAllLocks } from './lock-manager'

describe('Distributed Lock specs', () => {
  beforeEach(() => {
    releaseAllLocks()
  })
  
  it('tries to acquire a lock and succeed', async () => {
    await expect(tryLock('lock-id')).resolves.toHaveLength(36)
  })

  it('tries to acquire a lock and fails', async () => {
    await tryLock('lock-id')
    await expect(tryLock('lock-id')).rejects.toBe("Lock: 'lock-id' is locked already.")
  })

  it('releases a lock', async () => {
    const refId = await tryLock('lock-id')
    await expect(releaseLock('lock-id', refId)).resolves.toBeUndefined()
  })

  it('tries to release a invalid lock and fails', async () => {
    await expect(releaseLock('invalid-id', 'ref-id')).rejects.toBe("Lock: 'invalid-id' is invalid")
  })

  it('tries to release a lock with invalid ref and fails', async () => {
    await tryLock('lock-id')
    await expect(releaseLock('lock-id', 'invalid-ref-id')).rejects.toBe("Reference: 'invalid-ref-id' is invalid")
  })
})