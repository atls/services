import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateUploadResponse {
    @Field()
    id: string
  
    @Field()
    url: string
}