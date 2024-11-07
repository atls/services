import type { MigrationInterface } from 'typeorm'
import type { QueryRunner }        from 'typeorm'

export class CreateUpload1628686633429 implements MigrationInterface {
  name = 'CreateUpload1628686633429'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "upload_aggregate" ("id" uuid NOT NULL, "ownerId" uuid NOT NULL, "url" character varying NOT NULL, "name" character varying NOT NULL, "filename" character varying NOT NULL, "bucket" jsonb NOT NULL, "confirmed" boolean NOT NULL, CONSTRAINT "PK_2629836d1338e5fd6df61994dca" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "upload_aggregate"`)
  }
}
