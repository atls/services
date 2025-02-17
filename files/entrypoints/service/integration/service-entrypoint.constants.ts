import type { CreateUploadRequest }       from '@atls/services-proto-files'
import type { ListFilesRequest_Pager }    from '@atls/services-proto-files'
import type { FilesBucket }               from '@files/domain-module'
import type { GrpcIdentityModuleOptions } from '@files/grpc-adapter'

import { promises as fs }                 from 'fs'
import { join }                           from 'path'
import { dirname as pathDirname }         from 'path'

import { FilesBucketType }                from '@files/domain-module'

export const dirname = pathDirname(new URL(import.meta.url).pathname)

export const pager: ListFilesRequest_Pager = { offset: 0, take: 10 }

export const createBuckets = (hostname: string): Array<FilesBucket> => [
  {
    name: FilesBucketType.PUBLIC,
    type: FilesBucketType.PUBLIC,
    bucket: 'test',
    path: '/',
    hostname,
    conditions: {
      type: 'image/*',
      length: {
        min: 0,
        max: 1000,
      },
    },
    expiration: 1800000,
  },
]

export const uploadRequest: CreateUploadRequest = {
  bucket: FilesBucketType.PUBLIC,
  name: 'test.png',
  size: 206,
}

export const grpcIdentityOptions: GrpcIdentityModuleOptions = {
  jwks: {
    jwksUri: join(dirname, '../../../../.config/dev/.jwks.json'),
    fetcher: async (jwksUri: string) => {
      const data = await fs.readFile(jwksUri)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(data.toString())
    },
    cache: true,
    jwksRequestsPerMinute: 5,
  },
}
