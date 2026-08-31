import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ADD COLUMN "rate_limit_key" varchar;
  CREATE INDEX "leads_rate_limit_key_idx" ON "leads" USING btree ("rate_limit_key");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "leads_rate_limit_key_idx";
  ALTER TABLE "leads" DROP COLUMN "rate_limit_key";`)
}
