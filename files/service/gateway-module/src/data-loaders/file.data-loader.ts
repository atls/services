import type { File }           from '@atls/files-rpc-client'

import type { NestDataLoader } from '../interfaces/index.js'

import { Injectable }          from '@nestjs/common'
import DataLoader              from 'dataloader'

import { client }              from '@atls/files-rpc-client'

@Injectable()
export class FileDataLoader implements NestDataLoader<string, File | undefined> {
  async getFiles(ids: ReadonlyArray<string>): Promise<Array<File | undefined>> {
    const { files } = await client.listFiles({
      query: {
        id: {
          conditions: {
            in: { values: ids as Array<string> },
          },
        },
      },
    })

    const filesById: Map<string, File> = files.reduce(
      (result, file) => result.set(file.id, file),
      new Map<string, File>()
    )

    return ids.map((id) => filesById.get(id))
  }

  generateDataLoader(): DataLoader<string, File | undefined> {
    return new DataLoader<string, File | undefined>(async (ids) => this.getFiles(ids))
  }
}
