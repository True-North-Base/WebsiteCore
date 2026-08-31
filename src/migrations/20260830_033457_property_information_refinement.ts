import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_rental_settings_marketplace_links_platform" ADD VALUE 'instagram' BEFORE 'direct';
  ALTER TYPE "public"."enum_rental_settings_marketplace_links_platform" ADD VALUE 'facebook' BEFORE 'direct';
  ALTER TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform" ADD VALUE 'instagram' BEFORE 'direct';
  ALTER TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform" ADD VALUE 'facebook' BEFORE 'direct';
  ALTER TABLE "properties_locales" ADD COLUMN "things_to_know_cancellation_summary" varchar;
  ALTER TABLE "properties_locales" ADD COLUMN "things_to_know_cancellation_details" varchar;
  ALTER TABLE "properties_locales" ADD COLUMN "things_to_know_events" varchar;
  ALTER TABLE "properties_locales" ADD COLUMN "things_to_know_property_rules_details" varchar;
  ALTER TABLE "_properties_v_locales" ADD COLUMN "version_things_to_know_cancellation_summary" varchar;
  ALTER TABLE "_properties_v_locales" ADD COLUMN "version_things_to_know_cancellation_details" varchar;
  ALTER TABLE "_properties_v_locales" ADD COLUMN "version_things_to_know_events" varchar;
  ALTER TABLE "_properties_v_locales" ADD COLUMN "version_things_to_know_property_rules_details" varchar;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "rental_settings_marketplace_links" WHERE "platform" IN ('instagram', 'facebook');
  DELETE FROM "_rental_settings_v_version_marketplace_links" WHERE "platform" IN ('instagram', 'facebook');
   ALTER TABLE "rental_settings_marketplace_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_rental_settings_marketplace_links_platform";
  CREATE TYPE "public"."enum_rental_settings_marketplace_links_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  ALTER TABLE "rental_settings_marketplace_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_rental_settings_marketplace_links_platform" USING "platform"::"public"."enum_rental_settings_marketplace_links_platform";
  ALTER TABLE "_rental_settings_v_version_marketplace_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform";
  CREATE TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  ALTER TABLE "_rental_settings_v_version_marketplace_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform" USING "platform"::"public"."enum__rental_settings_v_version_marketplace_links_platform";
  ALTER TABLE "properties_locales" DROP COLUMN "things_to_know_cancellation_summary";
  ALTER TABLE "properties_locales" DROP COLUMN "things_to_know_cancellation_details";
  ALTER TABLE "properties_locales" DROP COLUMN "things_to_know_events";
  ALTER TABLE "properties_locales" DROP COLUMN "things_to_know_property_rules_details";
  ALTER TABLE "_properties_v_locales" DROP COLUMN "version_things_to_know_cancellation_summary";
  ALTER TABLE "_properties_v_locales" DROP COLUMN "version_things_to_know_cancellation_details";
  ALTER TABLE "_properties_v_locales" DROP COLUMN "version_things_to_know_events";
  ALTER TABLE "_properties_v_locales" DROP COLUMN "version_things_to_know_property_rules_details";`)
}
