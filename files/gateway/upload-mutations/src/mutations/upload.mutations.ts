// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Observable }             from 'rxjs'

import { Metadata }                    from '@grpc/grpc-js'
import { Inject }                      from '@nestjs/common'
import { Context }                     from '@nestjs/graphql'
import { Args }                        from '@nestjs/graphql'
import { Mutation }                    from '@nestjs/graphql'
import { Resolver }                    from '@nestjs/graphql'

import { Upload }                      from '@atls/services-gateway-upload-types'
import { UPLOAD_SERVICE_CLIENT_TOKEN } from '@atls/services-proto-upload'
import { UploadServiceClient }         from '@atls/services-proto-upload'

import { ConfirmUploadInput }          from '../inputs/index.js'
import { CreateUploadInput }           from '../inputs/index.js'
import { ConfirmUploadResponse }       from '../types/index.js'
import { CreateUploadResponse }        from '../types/index.js'

@Resolver(() => Upload)
export class UploadMutations {
  // @ts-expect-error
  constructor(@Inject(UPLOAD_SERVICE_CLIENT_TOKEN) private readonly client: UploadServiceClient) {}

  @Mutation(() => CreateUploadResponse)
  createUpload(
    @Args('input')
    input: CreateUploadInput,
    @Context('authorization') authorization: string
  ): Observable<CreateUploadResponse> {
    const metadata = new Metadata()

    metadata.set('authorization', authorization)

    return this.client.createUpload(input, metadata)
  }

  @Mutation(() => ConfirmUploadResponse)
  confirmUpload(
    @Args('input')
    input: ConfirmUploadInput,
    @Context('authorization') authorization: string
  ): Observable<ConfirmUploadResponse> {
    const metadata = new Metadata()

    metadata.set('authorization', authorization)

    return this.client.confirmUpload(input, metadata)
  }
}
