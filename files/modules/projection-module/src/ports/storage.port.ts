export interface StoragePort {
  generateReadUrl(
    bucket: string,
    filename: string,
    cname?: string,
    expiration?: number
  ): Promise<string>
}
