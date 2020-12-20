import { getInventory, updateStock, addPendingOrder, getPendingOrders, removePendingOrder, clearPendingOrdersTable } from './inventory-db'

jest.mock('./inventorySeed.json', () => [
  {
    productId: '100',
    title: 'Product 1',
    actualQuantity: 10,
    availableQuantity: 10,
    createdOn: '2018-04-23T10:26:00.996Z',
    modifiedOn: '2018-04-23T10:26:00.996Z'
  },
  {
    productId: '102',
    title: 'Product w',
    actualQuantity: 20,
    availableQuantity: 20,
    createdOn: '2018-04-23T10:26:00.996Z',
    modifiedOn: '2018-04-23T10:26:00.996Z'
  }
])

describe('Inventory DB specs', () => {
  describe('Inventory table specs', () => {
    it('gets inventory', async () => {
      const table = await getInventory()

      expect(table).toHaveLength(2)
      expect(table[0].productId).toBe('100')
      expect(table[1].actualQuantity).toBe(20)
    })

    it('updates quantity of product with id "102"', async () => {
      const productId = '102'
      await updateStock(productId, 18, 20)

      const table = await getInventory()
      const product = table.find(row => row.productId === productId)

      expect(product?.availableQuantity).toBe(18)
      expect(product?.actualQuantity).toBe(20)
    })

    it('throws error when invalid product id is used', async () => {
      const productId = 'invalid-id'
      await expect(updateStock(productId, 18, 20)).rejects.toThrowError("ProductId: 'invalid-id' is invalid")
    })
  })

  describe('Pending Orders table specs', () => {
    beforeEach(() => {
      clearPendingOrdersTable()
    })

    it('sets a pending order', async () => {
      const pendingOrder = {
        userId: 'user-1',
        items: [
          {
            productId: '102',
            quantity: 1
          }
        ]
      }

      await expect(addPendingOrder(pendingOrder)).resolves.toHaveLength(36)
    })

    it('gets pending orders', async () => {
      const userId = 'user-1'
      const pendingOrder = {
        userId,
        items: [
          {
            productId: '102',
            quantity: 1
          }
        ]
      }
      await addPendingOrder(pendingOrder)
      const orders = await getPendingOrders(userId)
      expect(orders).toHaveLength(1)

      const { items, validTill } = orders[0]
      const remainingTime = new Date(validTill).getTime() - Date.now()
      expect(remainingTime).toBeLessThanOrEqual(5 * 60000)
      expect(items[0].productId).toBe('102')
    })

    it('removes a pending order', async () => {
      const pendingOrder = {
        userId: 'user-1',
        items: [
          {
            productId: '102',
            quantity: 1
          }
        ]
      }
      const orderId = await addPendingOrder(pendingOrder)

      await expect(removePendingOrder(orderId)).resolves.toBeUndefined()
    })

    it('fails removing an invalid pending order', async () => {
      await expect(removePendingOrder('invalid-id')).rejects.toThrowError("Order Id: 'invalid-id' is invalid")
    })
  })
})
