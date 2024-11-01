import type { Upload } from '../aggregates'

export abstract class UploadRepository {
  abstract create(): Upload

  abstract save(data: Upload): Promise<void>

  abstract findById(id: string): Promise<Upload | undefined>
}
