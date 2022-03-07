import { Field }     from '@nestjs/graphql'
import { InputType } from '@nestjs/graphql'

@InputType()
export class CreateUploadInput {
  @Field()
  bucket: string

  @Field()
  name: string

  @Field()
  size: number
}
