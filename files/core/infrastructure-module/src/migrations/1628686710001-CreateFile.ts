import type { MigrationInterface } from 'typeorm'
import type { QueryRunner }        from 'typeorm'

export class CreateFile1628686710001 implements MigrationInterface {
  name = 'CreateFile1628686710001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "files_type_enum" AS ENUM('public', 'private')`)
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL, "type" "files_type_enum" NOT NULL DEFAULT 'private', "ownerId" uuid NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "bucket" character varying NOT NULL, "size" integer NOT NULL, "contentType" character varying, "cacheControl" character varying, "contentDisposition" character varying, "contentEncoding" character varying, "contentLanguage" character varying, "metadata" jsonb DEFAULT '{}', CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "files"`)
    await queryRunner.query(`DROP TYPE "files_type_enum"`)
  }
}
