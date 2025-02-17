import type { FilesBucketType } from './files-bucket.type.js'

export interface FilesBucketConditionsLength {
  min: number
  max: number
}

export interface FilesBucketConditions {
  type: string
  length: FilesBucketConditionsLength
}

export interface FilesBucket {
  name: string
  type: FilesBucketType
  bucket: string
  path: string
  expiration: number
  conditions: FilesBucketConditions
  hostname?: string
}
