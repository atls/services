import { Validator }  from '@atls/nestjs-validation'
import { Logger }     from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { QueryBus }   from '@nestjs/cqrs'
import { IQuery }     from '@nestjs/cqrs'

/**
 * @description Orchestrates the full ConnectRPC → DTO → Query → Response pipeline.
 * Validates input, maps to query, dispatches via CQRS, maps back to response.
 * @requires exception filter for uniform error handling.
 */
@Injectable()
export class ConnectRpcQueryHandler {
  private readonly logger = new Logger(ConnectRpcQueryHandler.name)

  constructor(
    private readonly validator: Validator,
    private readonly queryBus: QueryBus
  ) {}

  async handle<
    RequestType extends object,
    QueryType extends IQuery,
    QueryResponse,
    RequestResponse,
  >(
    request: RequestType,
    dto: new (...args: Array<any>) => RequestType,
    queryMapper: (dto: RequestType) => QueryType,
    responseMapper: (result: QueryResponse) => RequestResponse
  ): Promise<RequestResponse> {
    try {
      this.logger.debug(`${queryMapper.name} validating request`)

      await this.validator.validate(request, dto)

      this.logger.debug(`${queryMapper.name} executing query`)

      const query = queryMapper(request)

      const result = await this.queryBus.execute<QueryType, QueryResponse>(query)

      return responseMapper(result)
    } catch (error) {
      this.logger.error(`${queryMapper.name} execution failed`)
      throw error
    } finally {
      this.logger.debug(`${queryMapper.name} done`)
    }
  }
}
