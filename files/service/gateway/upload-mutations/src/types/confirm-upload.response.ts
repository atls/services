import { Field }      from '@nestjs/graphql'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ConfirmUploadResponse {
  @Field()
  id: string

  @Field()
  url: string
}
