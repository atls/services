import type { StrapiConfig } from '../interfaces/index.js'

export const STRAPI_GRAPHQL_URL_FALLBACK = 'http://localhost:1337/graphql'

export const STRAPI_API_TOKEN_FALLBACK =
  '98f2eb4f7448afcdbcd546c4825ce106e085c3f8d6c48ff2f18d9812d31db14a3645b28264d9d9255750cc014a155ea1bf5db4ea5cb07431e1dc0f4666acbc68ecad755c32b69ff973f3620dc3cbe69a11ff81c8c8000d44e45feba0bca3f6c2ad5738d60645dc686cffed2414b93746454f5474d2e0af54a8ce409bdd12328a'

export const defaultStrapiConfig: StrapiConfig = {
  url: STRAPI_GRAPHQL_URL_FALLBACK,
  token: STRAPI_API_TOKEN_FALLBACK,
}
