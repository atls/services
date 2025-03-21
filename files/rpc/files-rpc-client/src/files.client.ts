import type { Client }                         from '@connectrpc/connect'

import { createClient as createPromiseClient } from '@connectrpc/connect'
import { createGrpcTransport }                 from '@connectrpc/connect-node'

import { FilesEngine }                         from '@atls/files-rpc/connect'

export const createClient = (options = {}): Client<typeof FilesEngine> =>
  createPromiseClient(
    FilesEngine,
    createGrpcTransport({
      httpVersion: '2',
      baseUrl: process.env.FILES_SERVICE_URL || 'http://0.0.0.0:50051',
      ...options,
    })
  )

export const client = createClient()
