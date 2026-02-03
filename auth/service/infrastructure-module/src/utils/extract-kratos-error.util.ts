import type { UiContainer } from '@ory/kratos-client'
import type { AxiosError }  from 'axios'

import type { KratosError } from '../interfaces/index.js'

const isAxiosError = (error: unknown): error is AxiosError => (error as AxiosError).isAxiosError

export const extractKratosError = (error: unknown): KratosError => {
  const message = error instanceof Error ? error.message : ''

  let details: string | undefined

  if (isAxiosError(error)) {
    const { ui } = error.response?.data as { ui?: UiContainer }

    ui?.messages?.forEach((uiMessage) => {
      const messageText = uiMessage.type === 'error' ? uiMessage.text : undefined

      if (messageText) {
        details = details ? `${details}. ${messageText}` : messageText
      }
    })

    ui?.nodes.forEach((node) => {
      const messageText = node.messages.find((item) => item.type === 'error')?.text

      if (messageText) {
        details = details ? `${details}. ${messageText}` : messageText
      }
    })
  }

  return { message, details }
}
