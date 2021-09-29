import { Controller }                    from '@nestjs/common'
import { UseFilters }                    from '@nestjs/common'
import { UsePipes }                      from '@nestjs/common'
import { UseGuards }                     from '@nestjs/common'
import { Payload }                       from '@nestjs/microservices'
import { GrpcExceptionsFilter }          from '@atls/nestjs-grpc-errors'
import { GrpcValidationPipe }            from '@atls/nestjs-grpc-errors'
import { GrpcJwtIdentityGuard }          from '@atls/nestjs-grpc-identity'
import { Subject }                       from '@atls/nestjs-grpc-identity'
import { QueryGateway }                  from '@typa/common'

import { ListOwnedFilesResponse }        from '@atls/services-proto-files'
import { FilesServiceControllerMethods } from '@atls/services-proto-files'
import { FilesServiceController }        from '@atls/services-proto-files'
import { GetPublicFilesQuery }           from '@files/domain-module'
import { GetOwnedFilesQuery }            from '@files/domain-module'

import { ListPublicFilesDto }            from '../dto'
import { ListOwnedFilesDto }             from '../dto'

@Controller()
@FilesServiceControllerMethods()
@UseGuards(GrpcJwtIdentityGuard)
@UseFilters(new GrpcExceptionsFilter())
export class FilesController implements FilesServiceController {
  constructor(private readonly queryGateway: QueryGateway) {}

  @UsePipes(new GrpcValidationPipe())
  async listOwnedFiles(
    @Payload() request: ListOwnedFilesDto,
    @Subject() subject
  ): Promise<ListOwnedFilesResponse> {
    return this.queryGateway
      .query(new GetOwnedFilesQuery(subject, request.pager, request.query, request.order))
      .toPromise()
  }

  @UsePipes(new GrpcValidationPipe())
  async listPublicFiles(@Payload() request: ListPublicFilesDto): Promise<ListOwnedFilesResponse> {
    return this.queryGateway
      .query(new GetPublicFilesQuery(request.pager, request.query, request.order))
      .toPromise()
  }
}
