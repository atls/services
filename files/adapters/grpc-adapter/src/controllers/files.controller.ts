import type { ListFilesResponse }        from '@atls/services-proto-files'
import type { FilesServiceController }   from '@atls/services-proto-files'

import { GrpcExceptionsFilter }          from '@atls/nestjs-grpc-errors'
import { GrpcValidationPipe }            from '@atls/nestjs-grpc-errors'
import { Controller }                    from '@nestjs/common'
import { UseFilters }                    from '@nestjs/common'
import { UsePipes }                      from '@nestjs/common'
import { QueryBus }                      from '@nestjs/cqrs'
import { Payload }                       from '@nestjs/microservices'

import { FilesServiceControllerMethods } from '@atls/services-proto-files'
import { GetFilesQuery }                 from '@files/application-module'

import { ListFilesDto }                  from '../dto/index.js'

@Controller()
@FilesServiceControllerMethods()
@UseFilters(new GrpcExceptionsFilter())
export class FilesController implements FilesServiceController {
  constructor(private readonly queryBus: QueryBus) {}

  @UsePipes(new GrpcValidationPipe())
  async listFiles(@Payload() request: ListFilesDto): Promise<ListFilesResponse> {
    return this.queryBus.execute(new GetFilesQuery(request.pager, request.order, request.query))
  }
}
