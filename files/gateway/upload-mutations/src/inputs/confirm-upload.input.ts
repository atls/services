import { Field }     from '@nestjs/graphql'
import { ID }        from '@nestjs/graphql'
import { InputType } from '@nestjs/graphql'

@InputType()
export class ConfirmUploadInput {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Field((type) => ID)
  id: string
}
