import type { CreateUploadRequest }   from '@atls/services-proto-files'
import type { CreateUploadResponse }  from '@atls/services-proto-files'
import type { ListFilesRequest }      from '@atls/services-proto-files'
import type { ListFilesResponse }     from '@atls/services-proto-files'
import type { ConfirmUploadRequest }  from '@atls/services-proto-files'
import type { ConfirmUploadResponse } from '@atls/services-proto-files'

export interface TestCase {
  name: string
  request: Promise<object>
  exception?: string
}

export interface FilesService {
  listFiles: (request: ListFilesRequest) => Promise<ListFilesResponse>
  createUpload: (request: CreateUploadRequest) => Promise<CreateUploadResponse>
  confirmUpload: (request: ConfirmUploadRequest) => Promise<ConfirmUploadResponse>
}
