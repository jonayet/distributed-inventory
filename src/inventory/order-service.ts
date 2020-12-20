import { addPendingOrder, getPendingOrders, removePendingOrder, updateStock } from '@platform/persistence/inventory-db'
import logger from '@platform/logging/logger'
import { getInventory } from './repositories/inventory'
import { ConfirmationLinks, OrderItem, PendingOrder, PendingOrderResponse, PendingOrderStatus } from './schema'
import { BadRequest, InternalServerError, InvalidOrderError } from './errors'

export async function processOrder (userId: string, items: OrderItem[]) {
  const { invalidItems, availableItems, unavailableItems } = await getOrderDetails(items)

  if (invalidItems.length) {
    throw new InvalidOrderError('Invalid product received', invalidItems.map(item => item.productId))
  }

  if (!availableItems.length) {
    throw new BadRequest('No items available')
  }

  if (unavailableItems.length) {
    const { id, validTill } = await addPendingOrder({
      userId,
      items: availableItems
    })

    const response: PendingOrderResponse = {
      availableItems,
      unavailableItems,
      confirmation: new ConfirmationLinks(id, validTill)
    }

    return {
      status: 202,
      response
    }
  }

  return {
    status: 201,
    response: {
      message: 'Order created'
    }
  }
}

export async function confirmPendingOrder (userId: string, orderId: string) {
  try {
    const orders = await getPendingOrders(userId)
    const pendingOrder = orders.find(order => order.id === orderId)
    if (!pendingOrder) {
      throw new BadRequest(`Pending Order: ${orderId} is not valid`)
    }

    for (const orderItem of pendingOrder.items) {
      await updateActualQuantity(orderItem)
    }
    await removePendingOrder(orderId)
  } catch (err) {
    logger.log('error', err)
    throw err
  }
}

export async function cancelPendingOrder (userId: string, orderId: string) {
  try {
    const orders = await getPendingOrders(userId)
    const pendingOrder = orders.find(order => order.id === orderId)
    if (!pendingOrder) {
      throw new BadRequest(`Pending Order: ${orderId} is not valid`)
    }

    for (const orderItem of pendingOrder.items) {
      await restoreAvailableQuantity(orderItem)
    }
    await removePendingOrder(orderId)
  } catch (err) {
    logger.log('error', err)
    throw err
  }
}

export async function checkPendingOrder (userId: string, orderId: string) {
  const orders = await getPendingOrders(userId)
  const pendingOrder = orders.find(order => order.id === orderId)
  if (!pendingOrder) {
    throw new BadRequest(`Pending Order: ${orderId} is not valid`)
  }

  return {
    items: pendingOrder.items,
    confirmation: new ConfirmationLinks(pendingOrder.id, pendingOrder.validTill)
  } as PendingOrderStatus
}

export async function pendingOrders (userId: string): Promise<PendingOrder[]> {
  const pendingOrders = await getPendingOrders(userId)
  return pendingOrders.map(order => ({
    orderId: order.id,
    validTill: order.validTill
  }))
}

async function restoreAvailableQuantity (orderItem: OrderItem, restore: boolean = false) {
  const inventory = await getInventory()
  const inventoryItem = inventory.find(item => item.productId === orderItem.productId)
  if (!inventoryItem) {
    throw new InternalServerError(`Inventory not found for product id: ${orderItem.productId}`)
  }
  const { availableQuantity, actualQuantity } = inventoryItem

  // TODO: use distributed lock here
  await updateStock(orderItem.productId, availableQuantity + orderItem.quantity, actualQuantity)
}

async function updateActualQuantity (orderItem: OrderItem) {
  const inventory = await getInventory()
  const inventoryItem = inventory.find(item => item.productId === orderItem.productId)
  if (!inventoryItem) {
    throw new InternalServerError(`Inventory not found for product id: ${orderItem.productId}`)
  }
  const { availableQuantity, actualQuantity } = inventoryItem
  // TODO: use distributed lock here
  await updateStock(orderItem.productId, availableQuantity, actualQuantity - orderItem.quantity)
}

async function getOrderDetails (items: OrderItem[]) {
  const availableItems: OrderItem[] = []
  const unavailableItems: OrderItem[] = []
  const invalidItems: OrderItem[] = []

  for (const orderItem of items) {
    const inventory = await getInventory()
    const inventoryItem = inventory.find(inventoryItem => inventoryItem.productId === orderItem.productId)
    if (!inventoryItem) {
      invalidItems.push(orderItem)
      continue
    }

    if (inventoryItem.availableQuantity < orderItem.quantity) {
      unavailableItems.push(orderItem)
      continue
    }

    availableItems.push(orderItem)
    // TODO: use distributed lock here
    await updateStock(orderItem.productId, inventoryItem.availableQuantity - orderItem.quantity, inventoryItem.actualQuantity)
  }

  return {
    availableItems,
    unavailableItems,
    invalidItems
  }
}
