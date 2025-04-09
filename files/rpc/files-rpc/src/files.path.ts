import * as path from 'node:path'

const dirname = path.dirname(new URL(import.meta.url).pathname)

export const filesServicePath = path.join(
  dirname,
  '../tech/atls/files_engine/v1alpha1/files.service.proto'
)

export const includeDirs = [dirname, path.join(dirname, '..')]
