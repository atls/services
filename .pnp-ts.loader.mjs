import { dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { access } from 'node:fs/promises'

const mapping = new Map([
  ['.js', ['.js', '.ts', '.tsx', '.jsx']],
  ['.cjs', ['.cjs', '.cts']],
  ['.mjs', ['.mjs', '.mts']],
  ['.jsx', ['.jsx', '.tsx']],
])

export const resolve = async (specifier, context, next) => {
  if (!specifier.startsWith('.')) {
    return next(specifier, context)
  }

  const { parentURL } = context
  if (!parentURL || !parentURL.startsWith('file:')) {
    return next(specifier, context)
  }

  const specifiedExtension = extname(specifier)
  const sourceExtensions = mapping.get(specifiedExtension)
  if (!sourceExtensions) {
    return next(specifier, context)
  }

  const location = dirname(fileURLToPath(parentURL))
  const required = specifier.slice(0, -specifiedExtension.length)
  const path = join(location, required)

  const available = await Promise.all(
    sourceExtensions.map(async (sourceExtension) => {
      try {
        await access(path + sourceExtension)

        return true
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          (error.code === 'ENOENT' || error.code === 'ENOTDIR')
        ) {
          return false
        }

        throw error
      }
    })
  )

  const matchingExtension = sourceExtensions[available.indexOf(true)]

  if (matchingExtension) {
    return next(required + matchingExtension, context)
  }

  return next(specifier, context)
}
