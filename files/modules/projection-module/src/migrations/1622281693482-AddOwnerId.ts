import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOwnerId1622281693482 implements MigrationInterface {
  name = 'AddOwnerId1622281693482'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "uploads" ADD "ownerId" uuid NOT NULL DEFAULT '36262472-e3f4-4327-a700-9041c24dd12b'`
    )
    await queryRunner.query(
      `ALTER TABLE "files" ADD "ownerId" uuid NOT NULL DEFAULT '36262472-e3f4-4327-a700-9041c24dd12b'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "ownerId"`)
    await queryRunner.query(`ALTER TABLE "uploads" DROP COLUMN "ownerId"`)
  }
}
