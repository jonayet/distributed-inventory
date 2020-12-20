import { Controller, Route, Get, Tags, Query, Security, Request, Response } from 'tsoa'
import { AuthorizationError } from '../errors'
import { pendingOrders } from '../order-service'
import { Client, PendingOrder } from '../schema'

@Route('/pending')
@Tags('PendingController')
export class PendingController extends Controller {
  /**
   * Pending order controller
   */
  @Get()
  @Security('api_key')
  @Response<AuthorizationError>(401, 'Unauthorized')
  public async getPendingOrders (
    /**
     * Client parameter is used to identify the client. It can be **web** or **mobile**.
     * This is an optional parameter, **web** will be used by default.
     */
    @Query() client: Client = 'web',
    @Request() request: any
  ): Promise<PendingOrder[]> {
    return pendingOrders(request.user)
  }
}
