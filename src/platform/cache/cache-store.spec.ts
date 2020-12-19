import { CacheStore } from './cache-store'

describe('Inventory Cache specs', () => {
  const cache = new CacheStore()

  it('checks if "cacheId" has any cached value', async () => {
    await expect(cache.has('cacheId')).resolves.toBe(false)
  })

  it('sets a cache value with "cache10"', async () => {
    await expect(cache.set('cache10', 'value')).resolves.toBeUndefined()
  })

  it('gets a cached value', async () => {
    await expect(cache.get('cache10')).resolves.toBe('value')
  })

  it('removes a cached value', async () => {
    await expect(cache.has('cache10')).resolves.toBe(true)
    await expect(cache.remove('cache10')).resolves.toBeUndefined()
    await expect(cache.has('cache10')).resolves.toBe(false)
  })
})