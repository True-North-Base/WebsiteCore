import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_gallery_category" AS ENUM('exterior', 'living-room', 'kitchen', 'bedroom', 'amenities', 'other');
  CREATE TYPE "public"."enum__properties_v_version_gallery_category" AS ENUM('exterior', 'living-room', 'kitchen', 'bedroom', 'amenities', 'other');
  CREATE TABLE "properties_sleeping_arrangements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid
  );

  CREATE TABLE "properties_sleeping_arrangements_locales" (
  	"room_name" varchar,
  	"bed_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "_properties_v_version_sleeping_arrangements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"_uuid" varchar
  );

  CREATE TABLE "_properties_v_version_sleeping_arrangements_locales" (
  	"room_name" varchar,
  	"bed_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );

  ALTER TABLE "properties_gallery" ADD COLUMN "category" "enum_properties_gallery_category" DEFAULT 'other';
  ALTER TABLE "properties_gallery" ADD COLUMN "featured_in_showcase" boolean DEFAULT false;
  ALTER TABLE "_properties_v_version_gallery" ADD COLUMN "category" "enum__properties_v_version_gallery_category" DEFAULT 'other';
  ALTER TABLE "_properties_v_version_gallery" ADD COLUMN "featured_in_showcase" boolean DEFAULT false;
  ALTER TABLE "properties_sleeping_arrangements" ADD CONSTRAINT "properties_sleeping_arrangements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_sleeping_arrangements" ADD CONSTRAINT "properties_sleeping_arrangements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_sleeping_arrangements_locales" ADD CONSTRAINT "properties_sleeping_arrangements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_sleeping_arrangements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_sleeping_arrangements" ADD CONSTRAINT "_properties_v_version_sleeping_arrangements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_sleeping_arrangements" ADD CONSTRAINT "_properties_v_version_sleeping_arrangements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_sleeping_arrangements_locales" ADD CONSTRAINT "_properties_v_version_sleeping_arrangements_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v_version_sleeping_arrangements"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_sleeping_arrangements_order_idx" ON "properties_sleeping_arrangements" USING btree ("_order");
  CREATE INDEX "properties_sleeping_arrangements_parent_id_idx" ON "properties_sleeping_arrangements" USING btree ("_parent_id");
  CREATE INDEX "properties_sleeping_arrangements_image_idx" ON "properties_sleeping_arrangements" USING btree ("image_id");
  CREATE UNIQUE INDEX "properties_sleeping_arrangements_locales_locale_parent_id_un" ON "properties_sleeping_arrangements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_properties_v_version_sleeping_arrangements_order_idx" ON "_properties_v_version_sleeping_arrangements" USING btree ("_order");
  CREATE INDEX "_properties_v_version_sleeping_arrangements_parent_id_idx" ON "_properties_v_version_sleeping_arrangements" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_sleeping_arrangements_image_idx" ON "_properties_v_version_sleeping_arrangements" USING btree ("image_id");
  CREATE UNIQUE INDEX "_properties_v_version_sleeping_arrangements_locales_locale_p" ON "_properties_v_version_sleeping_arrangements_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "properties_sleeping_arrangements" CASCADE;
  DROP TABLE "properties_sleeping_arrangements_locales" CASCADE;
  DROP TABLE "_properties_v_version_sleeping_arrangements" CASCADE;
  DROP TABLE "_properties_v_version_sleeping_arrangements_locales" CASCADE;
  ALTER TABLE "properties_gallery" DROP COLUMN "category";
  ALTER TABLE "properties_gallery" DROP COLUMN "featured_in_showcase";
  ALTER TABLE "_properties_v_version_gallery" DROP COLUMN "category";
  ALTER TABLE "_properties_v_version_gallery" DROP COLUMN "featured_in_showcase";
  DROP TYPE "public"."enum_properties_gallery_category";
  DROP TYPE "public"."enum__properties_v_version_gallery_category";`)
}
