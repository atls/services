import { Field }               from '@nestjs/graphql'
import { ObjectType }          from '@nestjs/graphql'

import { ValidationErrorType } from '../types/index.js'

@ObjectType()
export class CreateUploadErrors {
  @Field(() => ValidationErrorType, { nullable: true })
  bucket?: ValidationErrorType

  @Field(() => ValidationErrorType, { nullable: true })
  name?: ValidationErrorType

  @Field(() => ValidationErrorType, { nullable: true })
  size?: ValidationErrorType
}
