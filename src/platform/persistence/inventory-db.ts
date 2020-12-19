import inventoryDB from './inventorySeed.json'

export async function getInventory() {
  return inventoryDB;
}

export async function updateStock(productId: string, availableQuantity: number, actualQuantity: number) {
  const product = inventoryDB.find(product => product.productId === productId)
  if(!product) return Promise.reject(`ProductId: '${productId}' is invalid`)

  product.actualQuantity = actualQuantity
  product.availableQuantity = availableQuantity
}