import { Metadata }                    from '@grpc/grpc-js'
import { Inject }                      from '@nestjs/common'
import { Context }                     from '@nestjs/graphql'
import { Args }                        from '@nestjs/graphql'
import { Mutation }                    from '@nestjs/graphql'
import { Resolver }                    from '@nestjs/graphql'

import { Upload }                      from '@atls/services-gateway-upload-types'
import { UPLOAD_SERVICE_CLIENT_TOKEN } from '@atls/services-proto-upload'
import { UploadServiceClient }         from '@atls/services-proto-upload'

import { ConfirmUploadInput }          from '../inputs'
import { CreateUploadInput }           from '../inputs'
import { ConfirmUploadResponse }       from '../types'
import { CreateUploadResponse }        from '../types'

@Resolver((of: typeof Upload) => Upload)
export class UploadMutations {
  constructor(@Inject(UPLOAD_SERVICE_CLIENT_TOKEN) private readonly client: UploadServiceClient) {}

  @Mutation((returns) => CreateUploadResponse)
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  createUpload(
    @Args('input')
    input: CreateUploadInput,
    @Context('authorization') authorization: string
  ) {
    const metadata = new Metadata()

    metadata.set('authorization', authorization)

    return this.client.createUpload(input, metadata)
  }

  @Mutation((returns) => ConfirmUploadResponse)
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  confirmUpload(
    @Args('input')
    input: ConfirmUploadInput,
    @Context('authorization') authorization: string
  ) {
    const metadata = new Metadata()

    metadata.set('authorization', authorization)

    return this.client.confirmUpload(input, metadata)
  }
}
