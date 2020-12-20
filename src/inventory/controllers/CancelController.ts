import { Controller, Route, Post, Tags, Query, Security, Path, Request, Response, SuccessResponse } from 'tsoa'
import { AuthorizationError } from '../errors'
import { cancelPendingOrder } from '../order-service'
import { Client, UUID } from '../schema'

@Route('/cancel')
@Tags('CancelController')
export class CancelController extends Controller {
  /**
   * Cancel order controller
   */
  @Post('{orderId}')
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  @SuccessResponse(200, 'Order canceled')
  public async cancelOrder (
    /**
     * OrderId is an UUID. It will be used to find the associated pending order.
     */
    @Path() orderId: UUID,

    /**
     * Client parameter is used to identify the client. It can be **web** or **mobile**.
     * This is an optional parameter, **web** will be used by default.
     */
    @Query() client: Client = 'web',
    @Request() request: any
  ) {
    this.setStatus(200)
    return cancelPendingOrder(request.user, orderId)
  }
}
