import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUploads1620557733364 implements MigrationInterface {
  name = 'CreateUploads1620557733364'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "uploads" ("id" uuid NOT NULL, "bucket" jsonb NOT NULL, "url" character varying NOT NULL, "name" character varying NOT NULL, "filename" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d1781d1eedd7459314f60f39bd3" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "uploads"`)
  }
}
