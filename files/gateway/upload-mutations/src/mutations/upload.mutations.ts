import { Metadata }                   from '@grpc/grpc-js'
import { Inject }                     from '@nestjs/common'
import { Context }                    from '@nestjs/graphql'
import { Args }                       from '@nestjs/graphql'
import { Mutation }                   from '@nestjs/graphql'
import { Resolver }                   from '@nestjs/graphql'
import { Observable }                 from 'rxjs'

import { Upload }                     from '@atls/services-gateway-upload-types'
import { FILES_SERVICE_CLIENT_TOKEN } from '@atls/services-proto-files'
import { FilesServiceClient }         from '@atls/services-proto-files'

import { ConfirmUploadInput }         from '../inputs/index.js'
import { CreateUploadInput }          from '../inputs/index.js'
import { ConfirmUploadResponse }      from '../types/index.js'
import { CreateUploadResponse }       from '../types/index.js'

@Resolver(() => Upload)
export class UploadMutations {
  constructor(@Inject(FILES_SERVICE_CLIENT_TOKEN) private readonly client: FilesServiceClient) {}

  @Mutation((returns) => CreateUploadResponse)
  createUpload(
    @Args('input')
    input: CreateUploadInput,
    @Context('authorization') authorization: string
  ): Observable<CreateUploadResponse> {
    const metadata = new Metadata()

    metadata.set('authorization', authorization)

    return this.client.createUpload(input, metadata)
  }

  @Mutation((returns) => ConfirmUploadResponse)
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
