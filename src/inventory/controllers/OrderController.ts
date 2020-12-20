import { Controller, Route, Post, Tags, Query, Security, Response, Body } from 'tsoa'
import { AuthorizationError } from '../authentication'
import { Client, OrderItem } from '../schema'

@Route('/order')
@Tags('OrderController')
export class OrderController extends Controller {
  /**
   * @param client client parameter is used to identify the client. It can be **web** or **mobile**.
   * This is an optional parameter, **web** will be used by default.
   */
  @Post()
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  // @Response<ValidattionError>(422, 'Validation Failed')
  public async createOrder (
    @Query() client: Client = 'web',
    @Body() items: OrderItem[]
  ) {
    console.log(items)
  }
}
