import type { FilesEngine }             from '@atls/files-rpc/connect'
import type { File }                    from '@atls/files-rpc/connect'
import type { ListFilesRequest }        from '@atls/files-rpc/connect'
import type { ListFilesResponse }       from '@atls/files-rpc/connect'
import type { CreateUploadRequest }     from '@atls/files-rpc/connect'
import type { CreateUploadResponse }    from '@atls/files-rpc/connect'
import type { ConfirmUploadRequest }    from '@atls/files-rpc/connect'
import type { ConfirmUploadResponse }   from '@atls/files-rpc/connect'
import type { GenerateFileUrlRequest }  from '@atls/files-rpc/connect'
import type { GenerateFileUrlResponse } from '@atls/files-rpc/connect'
import type { PartialMessage }          from '@bufbuild/protobuf'
import type { Client }                  from '@connectrpc/connect'

import { Inject }                       from '@nestjs/common'
import { Injectable }                   from '@nestjs/common'

import { FILES_RPC_CLIENT_TOKEN }       from '../constants/index.js'
import { FileByIdDataLoader }           from '../dataloaders/index.js'

@Injectable()
export class FilesRPCClient {
  constructor(
    @Inject(FILES_RPC_CLIENT_TOKEN)
    protected readonly client: Client<typeof FilesEngine>,
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
