import { GrpcExceptionsFilter }          from '@atls/nestjs-grpc-errors'
import { GrpcValidationPipe }            from '@atls/nestjs-grpc-errors'
import { Controller }                    from '@nestjs/common'
import { UseFilters }                    from '@nestjs/common'
import { UsePipes }                      from '@nestjs/common'
import { UseGuards }                     from '@nestjs/common'
import { Payload }                       from '@nestjs/microservices'
import { v4 as uuid }                    from 'uuid'

import { ListFilesResponse }             from '@atls/services-proto-files'
import { FilesServiceControllerMethods } from '@atls/services-proto-files'
import { FilesServiceController }        from '@atls/services-proto-files'
import { CreateUploadResponse }          from '@atls/services-proto-files'
import { ConfirmUploadResponse }         from '@atls/services-proto-files'
import { GetFilesQuery }                 from '@files/application-module'
import { CreateUploadCommand }           from '@files/application-module'
import { ConfirmUploadCommand }          from '@files/application-module'
import { GetUploadByIdQuery }            from '@files/application-module'
import { GetFileByIdQuery }              from '@files/application-module'
import { QueryBus }                      from '@files/cqrs-adapter'
import { CommandBus }                    from '@files/cqrs-adapter'
import { FindFilesByQueryResult }        from '@files/domain-module'

import { Subject }                       from '../decorators/index.js'
import { ConfirmUploadDto }              from '../dto/index.js'
import { CreateUploadDto }               from '../dto/index.js'
import { ListFilesDto }                  from '../dto/index.js'
import { GrpcJwtIdentityGuard }          from '../guards/index.js'

@Controller()
@FilesServiceControllerMethods()
@UseFilters(new GrpcExceptionsFilter())
@UseGuards(GrpcJwtIdentityGuard)
export class FilesController implements FilesServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UsePipes(new GrpcValidationPipe())
  // @ts-expect-error correct request types
  async listFiles(@Payload() request: ListFilesDto): Promise<ListFilesResponse> {
    const { files, hasNextPage } = await this.queryBus.execute<
      GetFilesQuery,
      FindFilesByQueryResult
    >(new GetFilesQuery(request.pager, request.order, request.query))

    return { files: files.map((file) => file.properties), hasNextPage }
  }

  @UsePipes(new GrpcValidationPipe())
  // @ts-expect-error correct subject types
  async createUpload(
    @Payload() request: CreateUploadDto,
    @Subject() subject: string
  ): Promise<CreateUploadResponse> {
    const command = new CreateUploadCommand(
      uuid(),
      subject,
      request.bucket,
      request.name,
      request.size
    )

    await this.commandBus.execute(command)

    return this.queryBus.execute(new GetUploadByIdQuery(command.id))
  }

  @UsePipes(new GrpcValidationPipe())
  // @ts-expect-error correct subject types
  async confirmUpload(
    @Payload() request: ConfirmUploadDto,
    @Subject() subject: string
  ): Promise<ConfirmUploadResponse> {
    const command = new ConfirmUploadCommand(request.id, subject)

    await this.commandBus.execute(command)

    return this.queryBus.execute(new GetFileByIdQuery(command.id))
  }
}
