import type { File } from '../aggregates/index.js'

interface IncludeCondition {
  values: Array<string>
}

interface EqualCondition {
  value: string
}

interface IdQuery {
  eq?: EqualCondition
  in?: IncludeCondition
}

export interface FilesQuery {
  id?: IdQuery
}

export interface FilesPager {
  take: number
  offset: number
}

export interface FilesOrder {
  field: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  direction: any
}

export interface FindFilesByQuery {
  pager: FilesPager
  order?: FilesOrder
  query?: FilesQuery
}

export interface FindFilesByQueryResult {
  files: Array<File>
  hasNextPage: boolean
}

export abstract class FileRepository {
  abstract create(): File

  abstract save(data: File): Promise<void>

  abstract findById(id: string): Promise<File | undefined>

  abstract findByQuery(query: FindFilesByQuery): Promise<FindFilesByQueryResult>
}
