import { Controller, Route, Post, Tags, Query, Security, Request, Response, Body, SuccessResponse } from 'tsoa'
import { AuthorizationError, BadRequest } from '../errors'
import { processOrder } from '../order-service'
import { Client, OrderItem, PendingOrderResponse } from '../schema'

@Route('/order')
@Tags('OrderController')
export class OrderController extends Controller {
  /**
   * Order controller
   * @example body [
   *  {
   *    "productId": "FZ2725",
   *    "quantity": 2
   *  },
   * {
   *    "productId": "H67407",
   *    "quantity": 2
   *  },
   * {
   *    "productId": "FX7978",
   *    "quantity": 4
   *  }
   * ]
   */
  @Post()
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  @Response<BadRequest>(400, 'Invalid order')
  @Response<PendingOrderResponse>(202, 'Pending order confirmation')
  @SuccessResponse(201, 'Order created')
  public async createOrder (
    /**
     * Client parameter is used to identify the client. It can be **web** or **mobile**.
     * This is an optional parameter, **web** will be used by default.
     */
    @Query() client: Client = 'web',

    /**
     * Body is an array of item id and quantity.
     */
    @Body() body: OrderItem[],

    @Request() request: any
  ) {
    const { status, response } = await processOrder(request.user, body)
    this.setStatus(status)
    return response
  }
}
