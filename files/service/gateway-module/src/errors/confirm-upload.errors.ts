import { ValidationError } from '@atls/protobuf-rpc'
import { Field }           from '@nestjs/graphql'
import { ObjectType }      from '@nestjs/graphql'

@ObjectType()
export class ConfirmUploadErrors {
  @Field(() => ValidationError, { nullable: true })
  id?: ValidationError
}
