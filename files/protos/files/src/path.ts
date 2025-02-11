/// <reference types='@monstrs/types-import-proto'/>

import * as path from 'node:path'

const dirname = path.dirname(new URL(import.meta.url).pathname)

export const filesServicePath = path.join(dirname, '../tech/atls/files/v1/files.service.proto')

export const includeDirs = [dirname, path.join(dirname, '..')]
