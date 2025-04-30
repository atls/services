import { Args } from '@nestjs/graphql'

export const InputArg = <T>(inputType: T): ParameterDecorator =>
  Args('input', { type: () => inputType })
