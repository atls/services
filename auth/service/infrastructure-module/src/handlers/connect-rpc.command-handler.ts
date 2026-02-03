import { Validator }  from '@atls/nestjs-validation'
import { Logger }     from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ICommand }   from '@nestjs/cqrs'

/**
 * @description Orchestrates the full ConnectRPC → DTO → Command → Response pipeline.
 * Validates input, maps to command, dispatches via CQRS, maps back to response.
 * @requires exception filter for uniform error handling.
 */
@Injectable()
export class ConnectRpcCommandHandler {
  private readonly logger = new Logger(ConnectRpcCommandHandler.name)

  constructor(
    private readonly validator: Validator,
    private readonly commandBus: CommandBus
  ) {}

  async handle<
    RequestType extends object,
    CommandType extends ICommand,
    CommandResponse,
    RequestResponse,
  >(
    request: RequestType,
    dto: new (...args: Array<any>) => RequestType,
    commandMapper: (dto: RequestType) => CommandType,
    responseMapper: (result: CommandResponse) => RequestResponse
  ): Promise<RequestResponse> {
    try {
      this.logger.debug(`${commandMapper.name} validating request`)

      await this.validator.validate(request, dto)

      this.logger.debug(`${commandMapper.name} executing command`)

      const command = commandMapper(request)

      const result = await this.commandBus.execute<CommandType, CommandResponse>(command)

      return responseMapper(result)
    } catch (error) {
      this.logger.error(`${commandMapper.name} execution failed`)
      throw error
    } finally {
      this.logger.debug(`${commandMapper.name} done`)
    }
  }
}
