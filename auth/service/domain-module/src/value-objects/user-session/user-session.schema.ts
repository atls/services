import { z }                 from 'zod'

import { UserAccountSchema } from '../user-account/index.js'

export const UserSessionSchema = z.object({
  token: z.string().min(1),
  account: UserAccountSchema.optional(),
})

export type UserSessionProps = z.infer<typeof UserSessionSchema>
