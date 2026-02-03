import { z } from 'zod'

export const UserAccountSchema = z.object({
  id: z.uuid(),
  email: z.email().optional(),
  phone: z.e164().optional(),
})

export type UserAccountProps = z.infer<typeof UserAccountSchema>
