import { Controller, Route, Get, Tags, Query, Security, Request, Response } from 'tsoa'
import { getInventory } from './inventory-service'

type Client = 'web'|'mobile'
type Lang = 'en-us'|'en-gb'|'de-de'|'es-es'

interface ValidattionError {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

@Route('/inventory')
@Tags('InventoryController')
export class InventoryController extends Controller {
  /**
   * Retrieves the inventory.
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
  @Security('api_key')
  @Response<string>(500, 'Internal server error')
  @Response<ValidattionError>(422, 'Validation Failed')
  public async get (
    @Query() count: number = 5,
    @Query() page: number = 0,
    @Query() client: Client = 'web',
    @Query() lang: Lang = 'en-us',
    @Request() request: any
  ) {
    this.setStatus(201)
    return getInventory(lang)
  }
}
