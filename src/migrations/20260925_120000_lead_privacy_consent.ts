import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" ADD COLUMN "privacy_consent_at" timestamp(3) with time zone;
    ALTER TABLE "leads" ADD COLUMN "privacy_notice_version" varchar;
    ALTER TABLE "leads" ADD COLUMN "retention_until" timestamp(3) with time zone;
    CREATE INDEX "leads_retention_until_idx" ON "leads" USING btree ("retention_until");
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "leads_retention_until_idx";
    ALTER TABLE "leads" DROP COLUMN "retention_until";
    ALTER TABLE "leads" DROP COLUMN "privacy_notice_version";
    ALTER TABLE "leads" DROP COLUMN "privacy_consent_at";
  `)
}
