import { Controller }                     from '@nestjs/common'
import { UseFilters }                     from '@nestjs/common'
import { UsePipes }                       from '@nestjs/common'
import { UseGuards }                      from '@nestjs/common'
import { Payload }                        from '@nestjs/microservices'
import { GrpcExceptionsFilter }           from '@atls/nestjs-grpc-errors'
import { GrpcValidationPipe }             from '@atls/nestjs-grpc-errors'
import { GrpcJwtIdentityGuard }           from '@atls/nestjs-grpc-identity'
import { Subject }                        from '@atls/nestjs-grpc-identity'
import { CommandGateway }                 from '@typa/common'
import { QueryGateway }                   from '@typa/common'
import { v4 as uuid }                     from 'uuid'

import { CreateUploadResponse }           from '@atls/services-proto-files'
import { ConfirmUploadResponse }          from '@atls/services-proto-files'
import { UploadServiceControllerMethods } from '@atls/services-proto-files'
import { UploadServiceController }        from '@atls/services-proto-files'
import { CreateUploadCommand }            from '@files/domain-module'
import { ConfirmUploadCommand }           from '@files/domain-module'
import { GetUploadByIdQuery }             from '@files/domain-module'
import { GetFileByIdQuery }               from '@files/domain-module'

import { ConfirmUploadDto }               from '../dto'
import { CreateUploadDto }                from '../dto'

@Controller()
@UploadServiceControllerMethods()
@UseGuards(GrpcJwtIdentityGuard)
@UseFilters(new GrpcExceptionsFilter())
export class UploadController implements UploadServiceController {
  constructor(
    private readonly commandGateway: CommandGateway,
    private readonly queryGateway: QueryGateway
  ) {}

  @UsePipes(new GrpcValidationPipe())
  async createUpload(
    @Payload() request: CreateUploadDto,
    @Subject() subject
  ): Promise<CreateUploadResponse> {
    const command = new CreateUploadCommand(
      uuid(),
      subject,
      request.bucket,
      request.name,
      request.size
    )

    await this.commandGateway.send(command).toPromise()

    return this.queryGateway.query(new GetUploadByIdQuery(command.uploadId)).toPromise()
  }

  @UsePipes(new GrpcValidationPipe())
  async confirmUpload(
    @Payload() request: ConfirmUploadDto,
    @Subject() subject
  ): Promise<ConfirmUploadResponse> {
    const command = new ConfirmUploadCommand(request.id, subject)

    await this.commandGateway.send(command).toPromise()

    return this.queryGateway.query(new GetFileByIdQuery(command.uploadId)).toPromise()
  }
}
