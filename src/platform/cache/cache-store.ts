export class CacheStore {
  memoryDB: Record<string, any> = {}

  async set (chacheId: string, value: any) {
    this.memoryDB[chacheId] = value
  }

  async get (chacheId: string) {
    return this.memoryDB[chacheId]
  }

  async has (chacheId: string) {
    return this.memoryDB[chacheId] !== undefined
  }

  async remove (chacheId: string) {
    delete this.memoryDB[chacheId]
  }
}
