import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init00011774433010101 implements MigrationInterface {
  name = 'Init00011774433010101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await queryRunner.query(
      `DO $$ BEGIN
        CREATE TYPE "public"."users_status_enum" AS ENUM ('ACTIVE', 'SUSPENDED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(120) NOT NULL,
        "email" citext NOT NULL,
        "passwordHash" character varying(255) NOT NULL,
        "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        "deletedAt" timestamptz,
        "version" integer NOT NULL DEFAULT 1,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "CK_users_name_nonempty" CHECK ("name" <> '')
      )`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "ux_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "ux_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_status_enum"`);
  }
}
