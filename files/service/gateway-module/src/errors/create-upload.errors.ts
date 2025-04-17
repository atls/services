import { Field }           from '@nestjs/graphql'
import { ObjectType }      from '@nestjs/graphql'

import { ValidationError } from '@shared/gateway-types'

@ObjectType()
export class CreateUploadErrors {
  @Field(() => ValidationError, { nullable: true })
  bucket?: ValidationError

  @Field(() => ValidationError, { nullable: true })
  name?: ValidationError

  @Field(() => ValidationError, { nullable: true })
  size?: ValidationError
}
