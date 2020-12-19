import { tryLock, releaseLock } from './lock-manager'

describe('Distributed Lock specs', () => {
  it('tries to acquire a lock and succeed', async () => {
    await expect(tryLock('lock-id', 'ref-id')).resolves.toBe(true)
  })

  it('tries to acquire a lock and fails', async () => {
    await expect(tryLock('lock-id', 'ref-id')).resolves.toBe(false)
  })

  it('releases a lock', async () => {
    await expect(releaseLock('lock-id', 'ref-id')).resolves.toBeUndefined()
  })

  it('tries to release a invalid lock and fails', async () => {
    await expect(releaseLock('invalid-id', 'ref-id')).rejects.toBe("Lock: 'invalid-id' is invalid")
  })

  it('tries to release a lock with invalid ref and fails', async () => {
    await tryLock('lock-id', 'ref-id')
    await expect(releaseLock('lock-id', 'invalid-ref-id')).rejects.toBe("Reference: 'invalid-ref-id' is invalid")
  })
})