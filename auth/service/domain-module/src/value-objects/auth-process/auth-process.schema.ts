import { z }               from 'zod'

import { AuthProcessType } from '../../enums/index.js'

export const AuthProcessSchema = z.object({
  id: z.uuid(),
  type: z.enum(AuthProcessType),
})

export type AuthProcessProps = z.infer<typeof AuthProcessSchema>

export type AuthProcessWithoutType = Omit<AuthProcessProps, 'type'>
