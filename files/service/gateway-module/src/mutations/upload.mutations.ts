/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { ValidationError }       from '@atls/protobuf-rpc'

import { Context }                    from '@nestjs/graphql'
import { Args }                       from '@nestjs/graphql'
import { Mutation }                   from '@nestjs/graphql'
import { Resolver }                   from '@nestjs/graphql'
import { client }                     from '@files-engine/files-rpc-client'
import { findValidationErrorDetails } from '@atls/protobuf-rpc'
import { GraphQLError }               from 'graphql'

import { ConfirmUploadInput }         from '../inputs/index.js'
import { CreateUploadInput }          from '../inputs/index.js'
import { ConfirmUploadResponse }      from '../responses/index.js'
import { CreateUploadResponse }       from '../responses/index.js'
import { Upload }                     from '../types/index.js'

@Resolver(() => Upload)
export class UploadMutations {
  @Mutation(() => CreateUploadResponse)
  async createUpload(
    @Args('input')
    input: CreateUploadInput,
    @Context('user') ownerId: string
  ): Promise<CreateUploadResponse> {
    try {
      return await client.createUpload({
        ...input,
        ownerId,
      })
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
    @Args('input')
    input: ConfirmUploadInput,
    @Context('user') ownerId: string
  ): Promise<ConfirmUploadResponse> {
    try {
      return await client.confirmUpload({
        ...input,
        ownerId,
      })
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
