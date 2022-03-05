/* eslint-disable */
import Long from 'long'
import _m0  from 'protobufjs/minimal'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface File {
  id: string
  url: string
}

export const TECH_ATLS_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
