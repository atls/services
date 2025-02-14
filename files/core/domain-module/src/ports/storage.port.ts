export interface StorageFileMetadata {
  bucket: string
  name: string
  size: number
  contentType?: string
  cacheControl?: string
  contentDisposition?: string
  contentEncoding?: string
  contentLanguage?: string
  metadata?: Record<string, string>
  mediaLink: string
}

export interface StoragePort {
  generateUploadUrl: (
    bucket: string,
    filename: string,
    contentLength: number,
    contentType: string
  ) => Promise<string>
  getMetadata: (bucket: string, filename: string) => Promise<StorageFileMetadata | null>
  generateReadUrl: (
    bucket: string,
    filename: string,
    cname?: string,
    expiration?: number
  ) => Promise<string>
}

export const STORAGE_PORT_TOKEN = '__storagePort'
