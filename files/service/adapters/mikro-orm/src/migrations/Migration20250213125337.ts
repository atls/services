import { Migration } from '@mikro-orm/migrations'

export class Migration20250213125337 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "uploads" alter column "confirmed" type boolean using ("confirmed"::boolean);`
    )
  }
}
