import { Field }              from '@nestjs/graphql'
import { ObjectType }         from '@nestjs/graphql'

import { CreateUploadErrors } from '../errors/index.js'
import { Upload }             from '../types/index.js'

@ObjectType()
export class CreateUploadResponse {
  @Field(() => Upload, { nullable: true })
  result?: Upload

  @Field(() => CreateUploadErrors, { nullable: true })
  errors?: CreateUploadErrors
}
