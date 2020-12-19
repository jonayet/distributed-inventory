import axios from 'axios'
import { CacheStore } from '@platform/cache/cache-store'
import { log } from '@platform/logging/logger'
import { priceServiceHost } from '../config'

const cache = new CacheStore()

export async function getPrice(productId: string, lang: string) {
  if(await cache.has(productId)) {
    return cache.get(productId)
  }

  try {
    const { data } = await axios.get(`${priceServiceHost}/product/${productId}`, {
      headers: {
        accept: 'application/json',
        'accept-language': lang
      }
    })
    await cache.set(productId, data)
    return data
  } catch (err) {
    log(err, 'error')
    throw new Error('Unable to reach price service')
  }
}