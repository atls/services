import type { CreateUploadResponse }      from '@atls/services-proto-upload'
import type { ConfirmUploadResponse }     from '@atls/services-proto-upload'
import type { UploadServiceController }   from '@atls/services-proto-upload'

import { GrpcExceptionsFilter }           from '@atls/nestjs-grpc-errors'
import { GrpcValidationPipe }             from '@atls/nestjs-grpc-errors'
import { GrpcJwtIdentityGuard }           from '@atls/nestjs-grpc-identity'
import { Subject }                        from '@atls/nestjs-grpc-identity'
import { Controller }                     from '@nestjs/common'
import { UseFilters }                     from '@nestjs/common'
import { UsePipes }                       from '@nestjs/common'
import { UseGuards }                      from '@nestjs/common'
import { CommandBus }                     from '@nestjs/cqrs'
import { QueryBus }                       from '@nestjs/cqrs'
import { Payload }                        from '@nestjs/microservices'
import { v4 as uuid }                     from 'uuid'

import { UploadServiceControllerMethods } from '@atls/services-proto-upload'
import { CreateUploadCommand }            from '@files/application-module'
import { ConfirmUploadCommand }           from '@files/application-module'
import { GetUploadByIdQuery }             from '@files/application-module'
import { GetFileByIdQuery }               from '@files/application-module'

import { ConfirmUploadDto }               from '../dto/index.js'
import { CreateUploadDto }                from '../dto/index.js'

@Controller()
@UploadServiceControllerMethods()
@UseGuards(GrpcJwtIdentityGuard)
@UseFilters(new GrpcExceptionsFilter())
export class UploadController implements UploadServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UsePipes(new GrpcValidationPipe())
  // @ts-expect-error
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
  // @ts-expect-error
  async confirmUpload(
    @Payload() request: ConfirmUploadDto,
    @Subject() subject: string
  ): Promise<ConfirmUploadResponse> {
    const command = new ConfirmUploadCommand(request.id, subject)

    await this.commandBus.execute(command)

    return this.queryBus.execute(new GetFileByIdQuery(command.id))
  }
}
