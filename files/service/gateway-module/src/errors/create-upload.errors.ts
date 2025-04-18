import { ValidationError } from '@atls/protobuf-rpc'
import { Field }           from '@nestjs/graphql'
import { ObjectType }      from '@nestjs/graphql'

@ObjectType()
export class CreateUploadErrors {
  @Field(() => ValidationError, { nullable: true })
  bucket?: ValidationError

  @Field(() => ValidationError, { nullable: true })
  name?: ValidationError

  @Field(() => ValidationError, { nullable: true })
  size?: ValidationError
}
