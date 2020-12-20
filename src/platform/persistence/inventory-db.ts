import { getUid, getTime } from '../utils'
import inventoryTable from './inventorySeed.json'

const ONE_MINUTE = 60 * 1000
const PENDING_ORDER_DURATION = 5 * ONE_MINUTE

interface PendingProduct {
  productId: string
  quantity: number
}

interface PendingOrderReuest {
  userId: string
  items: PendingProduct[]
}

export interface PendingOrder extends PendingOrderReuest {
  id: string
  validTill: string
}

const pendingOrdersTable: PendingOrder[] = []

export async function getInventory () {
  return inventoryTable
}

export async function updateStock (productId: string, availableQuantity: number, actualQuantity: number) {
  const product = inventoryTable.find(product => product.productId === productId)
  if (!product) return Promise.reject(new Error(`ProductId: '${productId}' is invalid`))

  product.actualQuantity = actualQuantity
  product.availableQuantity = availableQuantity
}

export async function addPendingOrder (data: PendingOrderReuest) {
  const id = getUid()
  const validTill = new Date(getTime() + PENDING_ORDER_DURATION).toUTCString()
  pendingOrdersTable.push({
    ...data,
    id,
    validTill
  })

  return id
}

export async function getPendingOrders (userId: string) {
  return pendingOrdersTable.filter(order => order.userId === userId)
}

export async function removePendingOrder (orderId: string) {
  const otherOrders = pendingOrdersTable.filter(order => order.id !== orderId)
  if (otherOrders.length === pendingOrdersTable.length) return Promise.reject(new Error(`Order Id: '${orderId}' is invalid`))

  clearPendingOrdersTable()
  otherOrders.forEach(order => pendingOrdersTable.push(order))
}

export function clearPendingOrdersTable () {
  pendingOrdersTable.length = 0
}
