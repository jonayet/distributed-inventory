import { Controller, Route, Post, Tags, Query, Security, Path, Request, Response, SuccessResponse } from 'tsoa'
import { AuthorizationError } from '../errors'
import { confirmPendingOrder } from '../order-service'
import { Client, UUID } from '../schema'

@Route('/confirm')
@Tags('ConfirmController')
export class ConfirmController extends Controller {
  /**
   * Confirm order controller
   */
  @Post('{orderId}')
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  @SuccessResponse(201, 'Order created')
  public async confirmOrder (
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
    this.setStatus(201)
    await confirmPendingOrder(request.user, orderId)
    return 'Order confirmed'
  }
}
