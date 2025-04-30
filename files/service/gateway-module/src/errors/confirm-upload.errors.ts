import { Field }               from '@nestjs/graphql'
import { ObjectType }          from '@nestjs/graphql'

import { ValidationErrorType } from '../types/index.js'

@ObjectType()
export class ConfirmUploadErrors {
  @Field(() => ValidationErrorType, { nullable: true })
  id?: ValidationErrorType
}
