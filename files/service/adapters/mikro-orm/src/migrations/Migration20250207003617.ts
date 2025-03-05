import { Migration } from '@mikro-orm/migrations'

export class Migration20250207003617 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "files" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "type" text check ("type" in ('public', 'private')) not null default 'private', "owner_id" uuid not null, "name" varchar(255) not null, "url" varchar(255) not null, "bucket" varchar(255) not null, "size" int not null, "content_type" varchar(255) null, "cache_control" varchar(255) null, "content_disposition" varchar(255) null, "content_encoding" varchar(255) null, "content_language" varchar(255) null, "metadata" jsonb null default '{}', constraint "files_pkey" primary key ("id"));`
    )

    this.addSql(
      `create table "uploads" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "owner_id" uuid not null, "url" varchar(255) not null, "name" varchar(255) not null, "filename" varchar(255) not null, "bucket" jsonb not null, "confirmed" varchar(255) not null, constraint "uploads_pkey" primary key ("id"));`
    )
  }
}
