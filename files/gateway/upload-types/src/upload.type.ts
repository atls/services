import { Field }      from '@nestjs/graphql'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Upload {
  @Field()
  id: string

  @Field()
  url: string
}
