import { Controller, Route, Get, Tags, Query, Security, Response } from 'tsoa'
import { getInventory } from '../inventory-service'
import { Client, Inventory, Lang, UInt32 } from '../schema'
import { AuthorizationError, ValidattionError } from '../errors'

@Route('/inventory')
@Tags('InventoryController')
export class InventoryController extends Controller {
  /**
   * Retrieves the inventory.
   * @isInt count please provide a unsigned integer value
   * @minimum count 1 value must be greater that or equal to 1
   */
  @Get()
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  @Response<ValidattionError>(422, 'Validation Failed')
  @Response<Inventory>(200, 'Product inventory')
  public async get (
    /**
     * Count is used to determine how many quantity will be send.
     * Its default value is **5**.
     */
    @Query() count: number = 5,

    /**
     * Page is used to determine to find which segment of data will be provided.
     * For example,
     * Lets say total number of inventory is 30. If **count** is 10, there will be 3 page segments.
     * In this case, valid page **value** are be 0, 1 and 2.
     * This is an optional parameter, default is 0.
     */
    @Query() page: UInt32 = 0,

    /**
    * Client parameter is used to identify the client. It can be **web** or **mobile**.
    * This is an optional parameter, **web** will be used by default.
    */
    @Query() client: Client = 'web',

    /**
     * Lang parameter is used to select the currency for price.
     * This is an optional param, default value is **en-us**.
     */
    @Query() lang: Lang = 'en-us'
  ) {
    return getInventory(count, page, client, lang)
  }
}
