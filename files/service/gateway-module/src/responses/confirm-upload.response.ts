import { Field }               from '@nestjs/graphql'
import { ObjectType }          from '@nestjs/graphql'

import { ConfirmUploadErrors } from '../errors/index.js'
import { File }                from '../types/index.js'

@ObjectType()
export class ConfirmUploadResponse {
  @Field(() => File, { nullable: true })
  result?: File

  @Field(() => ConfirmUploadErrors, { nullable: true })
  errors?: ConfirmUploadErrors
}
