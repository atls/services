import type { IQueryHandler }    from '@nestjs/cqrs'

import { Logger }                from '@nestjs/common'
import { QueryHandler }          from '@nestjs/cqrs'

import { UserAccount }           from '@auth/domain-module'

import { GetUserAccountQuery }   from '../../queries/index.js'
import { GetUserAccountUseCase } from '../../use-cases/index.js'

@QueryHandler(GetUserAccountQuery)
export class GetUserAccountQueryHandler implements IQueryHandler<GetUserAccountQuery, UserAccount> {
  private readonly logger = new Logger(GetUserAccountQueryHandler.name)

  constructor(private readonly useCase: GetUserAccountUseCase) {}

  async execute(query: GetUserAccountQuery): Promise<UserAccount> {
    try {
      return this.useCase.execute(query)
    } catch (error) {
      this.logger.error(`Error executing ${GetUserAccountQueryHandler.name}`)
      throw error
    }
  }
}
