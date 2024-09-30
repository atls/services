import type { FilesBucketType } from '@files/domain-module'

export interface BucketConditions {
  type: string
  length: { min: number; max: number }
}

export interface BucketConfig {
  name: string
  type: FilesBucketType
  bucket: string
  path: string
  hostname: string | undefined
  expiration: number
  conditions: BucketConditions
}
