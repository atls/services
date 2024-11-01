import type { FilesStorageAdapterOptionsFactory } from '../module'
import type { FilesStorageAdapterModuleOptions }  from '../module'

export class FilesApplicationEnvConfig implements FilesStorageAdapterOptionsFactory {
  createFilesStorageOptions(): FilesStorageAdapterModuleOptions {
    return {
      apiEndpoint: process.env.FILES_STORAGE_API_ENDPOINT,
      projectId: process.env.FILES_STORAGE_PROJECT_ID,
    }
  }
}
