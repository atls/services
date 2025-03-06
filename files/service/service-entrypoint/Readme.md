## Fille service

Для работы сервиса необходимы env:

1. Database connection:

- `POSTGRESQL_HOST`
- `POSTGRESQL_DATABASE`
- `POSTGRESQL_USER`
- `POSTGRESQL_PASSWORD`

2. Bucket options - может быть несколько, `SCOPE` динамический:

- `FILES_BUCKETS_SCOPE_BUCKET`
- `FILES_BUCKETS_SCOPE_HOSTNAME`
- `FILES_BUCKETS_SCOPE_TYPE` - `public` или `private`, по умолчанию `private`
- `FILES_BUCKETS_SCOPE_PATH` - по умолчанию `/`
- `FILES_BUCKETS_SCOPE_EXPIRATION` - по умолчанию 1800000
- `FILES_BUCKETS_SCOPE_conditions_type` - по умолчанию `image/*`
- `FILES_BUCKETS_SCOPE_conditions_length_min` - по умолчанию 0
- `FILES_BUCKETS_SCOPE_conditions_length_min` - по умолчанию 1000000

3. Storage options:

- `FILES_STORAGE_API_ENDPOINT`
- `FILES_STORAGE_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`

4. JWT authorization

- `IDENTITY_JWKS_URI`
- `IDENTITY_PRIVATE_KEY`

Примеры env лежат в `.config/.env`
