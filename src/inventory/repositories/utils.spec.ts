import { waitUntil } from './utils'

describe('Repository Utils specs', () => {
  it('waits untill cllback returns true ', async () => {
    const resolveTime = Date.now() + 70
    const callback = jest.fn(() => Promise.resolve(Date.now() > resolveTime))
    const promise = waitUntil(callback, 500, 20)

    await expect(promise).resolves.toBeUndefined()
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1)
    expect(callback.mock.calls.length).toBeLessThanOrEqual(10)
  })

  it('waits untill cllback and timeout rejects', async () => {
    const resolveTime = Date.now() + 100
    const callback = jest.fn(() => Promise.resolve(Date.now() > resolveTime))
    const promise = waitUntil(callback, 50, 10)

    await expect(promise).rejects.toThrowError('Timeout occured')
  })
})
