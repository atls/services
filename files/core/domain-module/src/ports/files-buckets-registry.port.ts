import type { FilesBucket } from '../interfaces/index.js'

export interface FilesBucketsRegistryPort {
  get: (name: string) => FilesBucket | undefined
}

export const FILES_BUCKETS_REGISTRY_PORT_TOKEN = '__filesBucketsRegistryPort'
