import { getInventory, updateStock } from './inventory-db'

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
    await expect(updateStock(productId, 18, 20)).rejects.toBe("ProductId: 'invalid-id' is invalid")
  })
})