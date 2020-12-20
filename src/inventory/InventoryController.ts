import { Controller, Route, Get, Tags, Query } from 'tsoa'
import { getInventory } from './inventory-service'

type Client = 'web'|'mobile'
type Lang = 'en-us'|'en-gb'|'de-de'|'es-es'

@Route('inventory')
@Tags('InventoryController')
export class InventoryController extends Controller {
  /**
   * Retrieves the inventory.
   * @param token Token parameter is simplified token which will provoke unauthorize access to the service.
   * This is a mendatory field, if not provided an unauthenticated error will be send.
   * @example token "user-1"
   *
   * @param count Count is used to determine how many quantity will be send.
   * Its default value is **5**.
   * @isInt count
   *
   * @param page Page is used to determine to find which segment of data will be provided.
   * For example,
   * Lets say total number of inventory is 30. If **count** is 10, there will be 3 page segments.
   * In this case, valid page **value** are be 0, 1 and 2.
   * This is an optional parameter, default is 0.
   * @isInt count
   *
   * @param client client parameter is used to identify the client. It can be **web** or **mobile**.
   * This is an optional parameter, **web** will be used by default.
   *
   * @param lang Lang parameter is used to select the currency for price.
   * This is an optional param, default value is **en-us**.
   */
  @Get()
  public get (
    @Query()
      token: string,
    @Query()
      count: number = 5,
    @Query()
    page: number = 0,
    @Query()
    client: Client = 'web',
    @Query()
    lang: Lang = 'en-us'
  ) {
    return getInventory(lang)
  }
}
