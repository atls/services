import assert from 'node:assert/strict'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assertContains = <T extends Record<number | string | symbol, any>>(
  source: T,
  subset: Partial<T>
): void => {
  Object.entries(subset).forEach(([key, value]) => {
    assert.ok(key in source, `Missing field: ${key}`)
    assert.equal(source[key], value, `Value mismatch for field: ${key}`)
  })
}
