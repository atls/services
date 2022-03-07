/* eslint-disable */
/// <reference types='@monstrs/types-import-proto'/>

declare const __non_webpack_require__: any

import { join } from 'path'

export const filesServicePath =
  typeof __non_webpack_require__ === 'undefined'
    ? join(__dirname, '../tech/atls/files/v1alpha1/files_service.proto')
    : require('../tech/atls/files/v1alpha1/files_service.proto').default

export const includeDirs = [__dirname, join(__dirname, '..')]
