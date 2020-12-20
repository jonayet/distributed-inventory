import { Controller, Route, Get, Tags, Query, Security, Path, Request, Response } from 'tsoa'
import { AuthorizationError } from '../errors'
import { checkPendingOrder } from '../order-service'
import { Client, UUID } from '../schema'

@Route('/status')
@Tags('StatusController')
export class StatusController extends Controller {
  /**
   * Status controller
   */
  @Get('{orderId}')
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  public async getOrderStatus (
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
    return checkPendingOrder(request.user, orderId)
  }
}
