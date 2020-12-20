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
    await expect(tryLock('lock-id')).resolves.toBeUndefined()
  })

  it('releases a lock', async () => {
    const refId = await tryLock('lock-id') as string
    await expect(releaseLock('lock-id', refId)).resolves.toBeUndefined()
  })

  it('tries to release a invalid lock and fails', async () => {
    await expect(releaseLock('invalid-id', 'ref-id')).rejects.toThrowError("Lock: 'invalid-id' is invalid")
  })

  it('tries to release a lock with invalid ref and fails', async () => {
    await tryLock('lock-id')
    await expect(releaseLock('lock-id', 'invalid-ref-id')).rejects.toThrowError("Reference: 'invalid-ref-id' is invalid")
  })
})
