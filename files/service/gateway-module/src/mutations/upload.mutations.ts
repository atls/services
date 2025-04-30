/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { ValidationError }       from '@atls/protobuf-rpc'

import { Mutation }                   from '@nestjs/graphql'
import { Resolver }                   from '@nestjs/graphql'
import { findValidationErrorDetails } from '@atls/protobuf-rpc'

import { client }                     from '@atls/files-rpc-client'

import { InputArg }                   from '../decorators/index.js'
import { ConfirmUploadInput }         from '../inputs/index.js'
import { CreateUploadInput }          from '../inputs/index.js'
import { ConfirmUploadResponse }      from '../responses/index.js'
import { CreateUploadResponse }       from '../responses/index.js'
import { Upload }                     from '../types/index.js'

@Resolver(() => Upload)
export class UploadMutations {
  @Mutation(() => CreateUploadResponse)
  async createUpload(
    @InputArg(CreateUploadInput) input: CreateUploadInput
  ): Promise<CreateUploadResponse> {
    try {
      return client.createUpload(input)
    } catch (error) {
      const details: Array<ValidationError> = findValidationErrorDetails(error)

      if (details.length > 0) {
        return details.reduce(
          (result, detail) => ({
            ...result,
            [detail.id]: {
              id: detail.messages.at(0)!.id,
              message: detail.messages.at(0)!.constraint,
            },
          }),
          {}
        )
      }

      throw error
    }
  }

  @Mutation(() => ConfirmUploadResponse)
  async confirmUpload(
    @InputArg(ConfirmUploadInput) input: ConfirmUploadInput
  ): Promise<ConfirmUploadResponse> {
    try {
      return await client.confirmUpload(input)
    } catch (error) {
      const details: Array<ValidationError> = findValidationErrorDetails(error)

      if (details.length > 0) {
        return details.reduce(
          (result, detail) => ({
            ...result,
            [detail.id]: {
              id: detail.messages.at(0)!.id,
              message: detail.messages.at(0)!.constraint,
            },
          }),
          {}
        )
      }

      throw error
    }
  }
}
