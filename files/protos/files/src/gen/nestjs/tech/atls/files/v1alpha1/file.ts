/* eslint-disable */
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'tech.atls.files.v1alpha1'

export interface File {
  id: string
  url: string
}

export const TECH_ATLS_FILES_V1ALPHA1_PACKAGE_NAME = 'tech.atls.files.v1alpha1'

function createBaseFile(): File {
  return { id: '', url: '' }
}

export const File = {
  encode(message: File, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.url !== '') {
      writer.uint32(18).string(message.url)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): File {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseFile()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.url = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },
}
