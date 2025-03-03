import type { FilesBucket }                             from '@files/domain-module'
import type { FilesBucketConditions }                   from '@files/domain-module'

import type { FilesBucketsConfigAdapterOptionsFactory } from '../module/index.js'
import type { FilesBucketsConfigAdapterModuleOptions }  from '../module/index.js'

import { Logger }                                       from '@atls/logger'

import { FilesBucketType }                              from '@files/domain-module'

export class FilesBucketsEnvConfig implements FilesBucketsConfigAdapterOptionsFactory {
  static FILES_BUCKETS_ENV_PREFIX = 'FILES_BUCKETS'

  private readonly logger = new Logger(FilesBucketsEnvConfig.name)

  createFilesBucketsConfigOptions(): FilesBucketsConfigAdapterModuleOptions {
    return {
      buckets: this.getBuckets(),
    }
  }

  protected getAvailableBuckets(): Array<string> {
    const bucketKeys: Array<string> = Object.keys(process.env).filter((key) =>
      key.startsWith(FilesBucketsEnvConfig.FILES_BUCKETS_ENV_PREFIX))

    return bucketKeys.reduce((result: Array<string>, key) => {
      const [scope] = key
        .replace(FilesBucketsEnvConfig.FILES_BUCKETS_ENV_PREFIX, '')
        .substring(1)
        .toLowerCase()
        .split('_')

      if (result.includes(scope)) {
        return result
      }

      return [...result, scope]
    }, [])
  }

  protected getValueFromEnv(...args: Array<any>): string | undefined {
    const key = [FilesBucketsEnvConfig.FILES_BUCKETS_ENV_PREFIX, ...args].join('_').toUpperCase()

    return process.env[key]
  }

  protected getBucketConditions(scope: string): FilesBucketConditions {
    // TODO: validate content type
    let type = this.getValueFromEnv(scope, 'conditions', 'type')
    let min = Number(this.getValueFromEnv(scope, 'conditions', 'length', 'min'))
    let max = Number(this.getValueFromEnv(scope, 'conditions', 'length', 'max'))

    if (!type) {
      this.logger.warn(
        `Condtitions type config not found for bucket ${scope}, use default 'image/*'`
      )

      type = 'image/*'
    }

    if (!min || Number.isNaN(min)) {
      min = 0
    }

    if (!max || Number.isNaN(max)) {
      this.logger.warn(
        `Conditions length max config not found for bucket ${scope}, use default 1000000`
      )

      max = 1000000
    }

    return {
      type,
      length: {
        min,
        max,
      },
    }
  }

  protected getBucketConfig(scope: string): FilesBucket {
    const type = (this.getValueFromEnv(scope, 'type') as FilesBucketType) || FilesBucketType.PRIVATE
    const bucket = this.getValueFromEnv(scope, 'bucket')
    const path = this.getValueFromEnv(scope, 'path') || '/'
    const hostname = this.getValueFromEnv(scope, 'hostname')
    let expiration = Number(this.getValueFromEnv(scope, 'expiration'))

    if (!bucket) {
      throw new Error(`Required option for bucket ${scope} bucket not found`)
    }

    if (Number.isNaN(expiration)) {
      this.logger.warn(`Expiration config not found for bucket ${scope}, use default 1800000`)

      expiration = 1800000
    }

    return {
      name: scope,
      type,
      bucket,
      path,
      hostname,
      expiration,
      conditions: this.getBucketConditions(scope),
    }
  }

  protected getBuckets(): Array<FilesBucket> {
    return this.getAvailableBuckets().map((scope) => this.getBucketConfig(scope))
  }
}
