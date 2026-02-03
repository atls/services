import type { StrapiConfig }           from '@auth/infrastructure-module'

import { registerAs }                  from '@nestjs/config'

import { STRAPI_API_TOKEN_FALLBACK }   from '@auth/infrastructure-module'
import { STRAPI_GRAPHQL_URL_FALLBACK } from '@auth/infrastructure-module'

export const strapiConfig = registerAs(
  'strapi',
  (): StrapiConfig => ({
    url: process.env.STRAPI_GRAPHQL_URL ?? STRAPI_GRAPHQL_URL_FALLBACK,
    token: process.env.STRAPI_API_TOKEN ?? STRAPI_API_TOKEN_FALLBACK,
  })
)
