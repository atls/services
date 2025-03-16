import type { PartialMessage }          from '@bufbuild/protobuf'
import type { Client }                  from '@connectrpc/connect'
import type { FilesService }            from '@atls/files-rpc'
import type { File }                    from '@atls/files-rpc'
import type { ListFilesRequest }        from '@atls/files-rpc'
import type { ListFilesResponse }       from '@atls/files-rpc'
import type { CreateUploadRequest }     from '@atls/files-rpc'
import type { CreateUploadResponse }    from '@atls/files-rpc'
import type { ConfirmUploadRequest }    from '@atls/files-rpc'
import type { ConfirmUploadResponse }   from '@atls/files-rpc'
import type { GenerateFileUrlRequest }  from '@atls/files-rpc'
import type { GenerateFileUrlResponse } from '@atls/files-rpc'

import { Inject }                       from '@nestjs/common'
import { Injectable }                   from '@nestjs/common'

import { FILES_RPC_CLIENT_TOKEN }       from '../constants/index.js'
import { FileByIdDataLoader }           from '../dataloaders/index.js'

@Injectable()
export class FilesRPCClient {
  constructor(
    @Inject(FILES_RPC_CLIENT_TOKEN)
    protected readonly client: Client<typeof FilesService>,
    protected readonly fileByIdDataLoader: FileByIdDataLoader
  ) {}

  async createUpload(request: PartialMessage<CreateUploadRequest>): Promise<CreateUploadResponse> {
    return this.client.createUpload(request)
  }

  async confirmUpload(
    request: PartialMessage<ConfirmUploadRequest>
  ): Promise<ConfirmUploadResponse> {
    return this.client.confirmUpload(request)
  }

  async generateFileUrl(
    request: PartialMessage<GenerateFileUrlRequest>
  ): Promise<GenerateFileUrlResponse> {
    return this.client.generateFileUrl(request)
  }

  async listFiles(request: PartialMessage<ListFilesRequest> = {}): Promise<ListFilesResponse> {
    return this.client.listFiles(request)
  }

  async loadFile(fileId: string): Promise<File> {
    return this.fileByIdDataLoader.load(fileId)
  }

  async loadFiles(fileIds: Array<string>): Promise<Array<Error | File>> {
    return this.fileByIdDataLoader.loadMany(fileIds)
  }
}
