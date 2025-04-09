import type { NextFunction } from 'express'
import type { Response }     from 'express'
import type { Request }      from 'express'

export const disableAllowOriginsHeader = (_: Request, res: Response, next: NextFunction): void => {
  const originalSend = res.send
  // @ts-expect-error function return parameter
  // eslint-disable-next-line func-names
  res.send = function (data): void {
    res.removeHeader('Access-Control-Allow-Origin')
    originalSend.call(this, data)
  }
  next()
}
