import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_properties_external_listings_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum_properties_region" AS ENUM('central-valley', 'pacific-coast');
  CREATE TYPE "public"."enum_properties_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_v_version_external_listings_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum__properties_v_version_region" AS ENUM('central-valley', 'pacific-coast');
  CREATE TYPE "public"."enum__properties_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_reviews_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reviews_v_version_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reviews_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_leads_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_leads_source" AS ENUM('contact-form', 'property-form');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'closed');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_rental_settings_marketplace_links_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum_rental_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform" AS ENUM('airbnb', 'booking', 'vrbo', 'expedia', 'direct');
  CREATE TYPE "public"."enum__rental_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__rental_settings_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_home_page_trust_features_icon" AS ENUM('home', 'wifi', 'message', 'shield', 'location', 'calendar');
  CREATE TYPE "public"."enum_home_page_hospitality_features_icon" AS ENUM('home', 'wifi', 'message', 'shield', 'location', 'calendar');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_trust_features_icon" AS ENUM('home', 'wifi', 'message', 'shield', 'location', 'calendar');
  CREATE TYPE "public"."enum__home_page_v_version_hospitality_features_icon" AS ENUM('home', 'wifi', 'message', 'shield', 'location', 'calendar');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_properties_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__properties_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_property_management_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__property_management_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__property_management_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('en', 'es');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "properties_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid
  );
  
  CREATE TABLE "properties_extra_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fact" varchar
  );
  
  CREATE TABLE "properties_amenity_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "properties_amenity_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "properties_amenity_groups_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "properties_external_listings" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_properties_external_listings_platform",
  	"url" varchar
  );
  
  CREATE TABLE "properties" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"region" "enum_properties_region",
  	"complex_name" varchar,
  	"hero_image_id" uuid,
  	"map_image_id" uuid,
  	"bedrooms" numeric,
  	"beds" numeric,
  	"bathrooms" numeric,
  	"max_guests" numeric,
  	"rating" numeric,
  	"things_to_know_check_in_time" varchar,
  	"things_to_know_check_out_time" varchar,
  	"things_to_know_min_stay_nights" numeric,
  	"approx_coordinates_latitude" numeric,
  	"approx_coordinates_longitude" numeric,
  	"seo_og_image_id" uuid,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_properties_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "properties_locales" (
  	"district" varchar,
  	"badge" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"neighborhood_description" varchar,
  	"parking" varchar,
  	"things_to_know_smoking" varchar,
  	"things_to_know_pets" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_properties_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_extra_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"fact" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_amenity_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_amenity_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v_version_amenity_groups_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_properties_v_version_external_listings" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"platform" "enum__properties_v_version_external_listings_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_properties_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_region" "enum__properties_v_version_region",
  	"version_complex_name" varchar,
  	"version_hero_image_id" uuid,
  	"version_map_image_id" uuid,
  	"version_bedrooms" numeric,
  	"version_beds" numeric,
  	"version_bathrooms" numeric,
  	"version_max_guests" numeric,
  	"version_rating" numeric,
  	"version_things_to_know_check_in_time" varchar,
  	"version_things_to_know_check_out_time" varchar,
  	"version_things_to_know_min_stay_nights" numeric,
  	"version_approx_coordinates_latitude" numeric,
  	"version_approx_coordinates_longitude" numeric,
  	"version_seo_og_image_id" uuid,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__properties_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__properties_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_properties_v_locales" (
  	"version_district" varchar,
  	"version_badge" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_neighborhood_description" varchar,
  	"version_parking" varchar,
  	"version_things_to_know_smoking" varchar,
  	"version_things_to_know_pets" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"guest_name" varchar,
  	"rating" numeric,
  	"platform" "enum_reviews_platform",
  	"property_id" uuid,
  	"featured" boolean DEFAULT false,
  	"source_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reviews_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "reviews_locales" (
  	"quote" varchar,
  	"guest_country" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_reviews_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_guest_name" varchar,
  	"version_rating" numeric,
  	"version_platform" "enum__reviews_v_version_platform",
  	"version_property_id" uuid,
  	"version_featured" boolean DEFAULT false,
  	"version_source_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__reviews_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_reviews_v_locales" (
  	"version_quote" varchar,
  	"version_guest_country" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"message" varchar,
  	"requested_dates" varchar,
  	"property_id" uuid,
  	"locale" "enum_leads_locale" DEFAULT 'en' NOT NULL,
  	"source" "enum_leads_source" NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"properties_id" uuid,
  	"reviews_id" uuid,
  	"leads_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_name" varchar DEFAULT 'CR Mariposa',
  	"whatsapp_number" varchar,
  	"phone_display" varchar,
  	"email" varchar,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"default_seo_og_image_id" uuid,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"address" varchar,
  	"whatsapp_default_message" varchar,
  	"default_seo_title" varchar,
  	"default_seo_description" varchar,
  	"default_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_site_name" varchar DEFAULT 'CR Mariposa',
  	"version_whatsapp_number" varchar,
  	"version_phone_display" varchar,
  	"version_email" varchar,
  	"version_instagram_url" varchar,
  	"version_facebook_url" varchar,
  	"version_default_seo_og_image_id" uuid,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_tagline" varchar,
  	"version_address" varchar,
  	"version_whatsapp_default_message" varchar,
  	"version_default_seo_title" varchar,
  	"version_default_seo_description" varchar,
  	"version_default_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "rental_settings_marketplace_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_rental_settings_marketplace_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "rental_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_status" "enum_rental_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "rental_settings_locales" (
  	"direct_booking_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_rental_settings_v_version_marketplace_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"platform" "enum__rental_settings_v_version_marketplace_links_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_rental_settings_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version__status" "enum__rental_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__rental_settings_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_rental_settings_v_locales" (
  	"version_direct_booking_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "home_page_trust_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_trust_features_icon"
  );
  
  CREATE TABLE "home_page_trust_features_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_hospitality_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_hospitality_features_icon"
  );
  
  CREATE TABLE "home_page_hospitality_features_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"hero_image_id" uuid,
  	"hero_mobile_image_id" uuid,
  	"trust_image_id" uuid,
  	"hospitality_image_id" uuid,
  	"seo_og_image_id" uuid,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"featured_heading" varchar,
  	"featured_intro" varchar,
  	"pacific_heading" varchar,
  	"pacific_intro" varchar,
  	"reviews_heading" varchar,
  	"reviews_proof" varchar,
  	"trust_eyebrow" varchar,
  	"trust_heading" varchar,
  	"trust_heading_muted" varchar,
  	"hospitality_eyebrow" varchar,
  	"hospitality_heading" varchar,
  	"hospitality_heading_muted" varchar,
  	"contact_heading" varchar,
  	"contact_body" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_trust_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"icon" "enum__home_page_v_version_trust_features_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_trust_features_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_hospitality_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"icon" "enum__home_page_v_version_hospitality_features_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_hospitality_features_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_hero_image_id" uuid,
  	"version_hero_mobile_image_id" uuid,
  	"version_trust_image_id" uuid,
  	"version_hospitality_image_id" uuid,
  	"version_seo_og_image_id" uuid,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_body" varchar,
  	"version_featured_heading" varchar,
  	"version_featured_intro" varchar,
  	"version_pacific_heading" varchar,
  	"version_pacific_intro" varchar,
  	"version_reviews_heading" varchar,
  	"version_reviews_proof" varchar,
  	"version_trust_eyebrow" varchar,
  	"version_trust_heading" varchar,
  	"version_trust_heading_muted" varchar,
  	"version_hospitality_eyebrow" varchar,
  	"version_hospitality_heading" varchar,
  	"version_hospitality_heading_muted" varchar,
  	"version_contact_heading" varchar,
  	"version_contact_body" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "properties_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"seo_og_image_id" uuid,
  	"_status" "enum_properties_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "properties_page_locales" (
  	"heading" varchar,
  	"introduction" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_properties_page_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_seo_og_image_id" uuid,
  	"version__status" "enum__properties_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__properties_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_properties_page_v_locales" (
  	"version_heading" varchar,
  	"version_introduction" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"seo_og_image_id" uuid,
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_image_id" uuid,
  	"version_seo_og_image_id" uuid,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__about_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_about_page_v_locales" (
  	"version_heading" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "property_management_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"seo_og_image_id" uuid,
  	"_status" "enum_property_management_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "property_management_page_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"cta_label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_property_management_page_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_image_id" uuid,
  	"version_seo_og_image_id" uuid,
  	"version__status" "enum__property_management_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__property_management_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_property_management_page_v_locales" (
  	"version_heading" varchar,
  	"version_body" jsonb,
  	"version_cta_label" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"seo_og_image_id" uuid,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"cta_label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"version_image_id" uuid,
  	"version_seo_og_image_id" uuid,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__contact_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_contact_page_v_locales" (
  	"version_heading" varchar,
  	"version_body" jsonb,
  	"version_cta_label" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_gallery" ADD CONSTRAINT "properties_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_extra_facts" ADD CONSTRAINT "properties_extra_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_amenity_groups_items" ADD CONSTRAINT "properties_amenity_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_amenity_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_amenity_groups" ADD CONSTRAINT "properties_amenity_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_amenity_groups_locales" ADD CONSTRAINT "properties_amenity_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_amenity_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_external_listings" ADD CONSTRAINT "properties_external_listings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_map_image_id_media_id_fk" FOREIGN KEY ("map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_locales" ADD CONSTRAINT "properties_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_version_gallery" ADD CONSTRAINT "_properties_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_extra_facts" ADD CONSTRAINT "_properties_v_version_extra_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_amenity_groups_items" ADD CONSTRAINT "_properties_v_version_amenity_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v_version_amenity_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_amenity_groups" ADD CONSTRAINT "_properties_v_version_amenity_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_amenity_groups_locales" ADD CONSTRAINT "_properties_v_version_amenity_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v_version_amenity_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v_version_external_listings" ADD CONSTRAINT "_properties_v_version_external_listings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_parent_id_properties_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_map_image_id_media_id_fk" FOREIGN KEY ("version_map_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v" ADD CONSTRAINT "_properties_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_v_locales" ADD CONSTRAINT "_properties_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reviews_locales" ADD CONSTRAINT "reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_property_id_properties_id_fk" FOREIGN KEY ("version_property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reviews_v_locales" ADD CONSTRAINT "_reviews_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_settings_marketplace_links" ADD CONSTRAINT "rental_settings_marketplace_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_settings_locales" ADD CONSTRAINT "rental_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rental_settings_v_version_marketplace_links" ADD CONSTRAINT "_rental_settings_v_version_marketplace_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rental_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rental_settings_v_locales" ADD CONSTRAINT "_rental_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rental_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_trust_features" ADD CONSTRAINT "home_page_trust_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_trust_features_locales" ADD CONSTRAINT "home_page_trust_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_trust_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hospitality_features" ADD CONSTRAINT "home_page_hospitality_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hospitality_features_locales" ADD CONSTRAINT "home_page_hospitality_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hospitality_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_trust_image_id_media_id_fk" FOREIGN KEY ("trust_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hospitality_image_id_media_id_fk" FOREIGN KEY ("hospitality_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_trust_features" ADD CONSTRAINT "_home_page_v_version_trust_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_trust_features_locales" ADD CONSTRAINT "_home_page_v_version_trust_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_trust_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hospitality_features" ADD CONSTRAINT "_home_page_v_version_hospitality_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hospitality_features_locales" ADD CONSTRAINT "_home_page_v_version_hospitality_features_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_hospitality_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("version_hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_trust_image_id_media_id_fk" FOREIGN KEY ("version_trust_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hospitality_image_id_media_id_fk" FOREIGN KEY ("version_hospitality_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_page" ADD CONSTRAINT "properties_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_page_locales" ADD CONSTRAINT "properties_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_properties_page_v" ADD CONSTRAINT "_properties_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_properties_page_v_locales" ADD CONSTRAINT "_properties_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_properties_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_locales" ADD CONSTRAINT "_about_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "property_management_page" ADD CONSTRAINT "property_management_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "property_management_page" ADD CONSTRAINT "property_management_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "property_management_page_locales" ADD CONSTRAINT "property_management_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."property_management_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_property_management_page_v" ADD CONSTRAINT "_property_management_page_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_property_management_page_v" ADD CONSTRAINT "_property_management_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_property_management_page_v_locales" ADD CONSTRAINT "_property_management_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_property_management_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_gallery_order_idx" ON "properties_gallery" USING btree ("_order");
  CREATE INDEX "properties_gallery_parent_id_idx" ON "properties_gallery" USING btree ("_parent_id");
  CREATE INDEX "properties_gallery_image_idx" ON "properties_gallery" USING btree ("image_id");
  CREATE INDEX "properties_extra_facts_order_idx" ON "properties_extra_facts" USING btree ("_order");
  CREATE INDEX "properties_extra_facts_parent_id_idx" ON "properties_extra_facts" USING btree ("_parent_id");
  CREATE INDEX "properties_extra_facts_locale_idx" ON "properties_extra_facts" USING btree ("_locale");
  CREATE INDEX "properties_amenity_groups_items_order_idx" ON "properties_amenity_groups_items" USING btree ("_order");
  CREATE INDEX "properties_amenity_groups_items_parent_id_idx" ON "properties_amenity_groups_items" USING btree ("_parent_id");
  CREATE INDEX "properties_amenity_groups_items_locale_idx" ON "properties_amenity_groups_items" USING btree ("_locale");
  CREATE INDEX "properties_amenity_groups_order_idx" ON "properties_amenity_groups" USING btree ("_order");
  CREATE INDEX "properties_amenity_groups_parent_id_idx" ON "properties_amenity_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "properties_amenity_groups_locales_locale_parent_id_unique" ON "properties_amenity_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_external_listings_order_idx" ON "properties_external_listings" USING btree ("_order");
  CREATE INDEX "properties_external_listings_parent_id_idx" ON "properties_external_listings" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "properties_slug_idx" ON "properties" USING btree ("slug");
  CREATE INDEX "properties_hero_image_idx" ON "properties" USING btree ("hero_image_id");
  CREATE INDEX "properties_map_image_idx" ON "properties" USING btree ("map_image_id");
  CREATE INDEX "properties_seo_seo_og_image_idx" ON "properties" USING btree ("seo_og_image_id");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  CREATE INDEX "properties__status_idx" ON "properties" USING btree ("_status");
  CREATE UNIQUE INDEX "properties_locales_locale_parent_id_unique" ON "properties_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_properties_v_version_gallery_order_idx" ON "_properties_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_properties_v_version_gallery_parent_id_idx" ON "_properties_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_gallery_image_idx" ON "_properties_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_properties_v_version_extra_facts_order_idx" ON "_properties_v_version_extra_facts" USING btree ("_order");
  CREATE INDEX "_properties_v_version_extra_facts_parent_id_idx" ON "_properties_v_version_extra_facts" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_extra_facts_locale_idx" ON "_properties_v_version_extra_facts" USING btree ("_locale");
  CREATE INDEX "_properties_v_version_amenity_groups_items_order_idx" ON "_properties_v_version_amenity_groups_items" USING btree ("_order");
  CREATE INDEX "_properties_v_version_amenity_groups_items_parent_id_idx" ON "_properties_v_version_amenity_groups_items" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_version_amenity_groups_items_locale_idx" ON "_properties_v_version_amenity_groups_items" USING btree ("_locale");
  CREATE INDEX "_properties_v_version_amenity_groups_order_idx" ON "_properties_v_version_amenity_groups" USING btree ("_order");
  CREATE INDEX "_properties_v_version_amenity_groups_parent_id_idx" ON "_properties_v_version_amenity_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_properties_v_version_amenity_groups_locales_locale_parent_i" ON "_properties_v_version_amenity_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_properties_v_version_external_listings_order_idx" ON "_properties_v_version_external_listings" USING btree ("_order");
  CREATE INDEX "_properties_v_version_external_listings_parent_id_idx" ON "_properties_v_version_external_listings" USING btree ("_parent_id");
  CREATE INDEX "_properties_v_parent_idx" ON "_properties_v" USING btree ("parent_id");
  CREATE INDEX "_properties_v_version_version_slug_idx" ON "_properties_v" USING btree ("version_slug");
  CREATE INDEX "_properties_v_version_version_hero_image_idx" ON "_properties_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_properties_v_version_version_map_image_idx" ON "_properties_v" USING btree ("version_map_image_id");
  CREATE INDEX "_properties_v_version_seo_version_seo_og_image_idx" ON "_properties_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_properties_v_version_version_updated_at_idx" ON "_properties_v" USING btree ("version_updated_at");
  CREATE INDEX "_properties_v_version_version_created_at_idx" ON "_properties_v" USING btree ("version_created_at");
  CREATE INDEX "_properties_v_version_version__status_idx" ON "_properties_v" USING btree ("version__status");
  CREATE INDEX "_properties_v_created_at_idx" ON "_properties_v" USING btree ("created_at");
  CREATE INDEX "_properties_v_updated_at_idx" ON "_properties_v" USING btree ("updated_at");
  CREATE INDEX "_properties_v_snapshot_idx" ON "_properties_v" USING btree ("snapshot");
  CREATE INDEX "_properties_v_published_locale_idx" ON "_properties_v" USING btree ("published_locale");
  CREATE INDEX "_properties_v_latest_idx" ON "_properties_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_properties_v_locales_locale_parent_id_unique" ON "_properties_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_property_idx" ON "reviews" USING btree ("property_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "reviews__status_idx" ON "reviews" USING btree ("_status");
  CREATE UNIQUE INDEX "reviews_locales_locale_parent_id_unique" ON "reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_reviews_v_parent_idx" ON "_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_reviews_v_version_version_property_idx" ON "_reviews_v" USING btree ("version_property_id");
  CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_reviews_v_version_version__status_idx" ON "_reviews_v" USING btree ("version__status");
  CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
  CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_reviews_v_snapshot_idx" ON "_reviews_v" USING btree ("snapshot");
  CREATE INDEX "_reviews_v_published_locale_idx" ON "_reviews_v" USING btree ("published_locale");
  CREATE INDEX "_reviews_v_latest_idx" ON "_reviews_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_reviews_v_locales_locale_parent_id_unique" ON "_reviews_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_property_idx" ON "leads" USING btree ("property_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_default_seo_default_seo_og_image_idx" ON "site_settings" USING btree ("default_seo_og_image_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_default_seo_version_default_seo_idx" ON "_site_settings_v" USING btree ("version_default_seo_og_image_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "rental_settings_marketplace_links_order_idx" ON "rental_settings_marketplace_links" USING btree ("_order");
  CREATE INDEX "rental_settings_marketplace_links_parent_id_idx" ON "rental_settings_marketplace_links" USING btree ("_parent_id");
  CREATE INDEX "rental_settings__status_idx" ON "rental_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "rental_settings_locales_locale_parent_id_unique" ON "rental_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_rental_settings_v_version_marketplace_links_order_idx" ON "_rental_settings_v_version_marketplace_links" USING btree ("_order");
  CREATE INDEX "_rental_settings_v_version_marketplace_links_parent_id_idx" ON "_rental_settings_v_version_marketplace_links" USING btree ("_parent_id");
  CREATE INDEX "_rental_settings_v_version_version__status_idx" ON "_rental_settings_v" USING btree ("version__status");
  CREATE INDEX "_rental_settings_v_created_at_idx" ON "_rental_settings_v" USING btree ("created_at");
  CREATE INDEX "_rental_settings_v_updated_at_idx" ON "_rental_settings_v" USING btree ("updated_at");
  CREATE INDEX "_rental_settings_v_snapshot_idx" ON "_rental_settings_v" USING btree ("snapshot");
  CREATE INDEX "_rental_settings_v_published_locale_idx" ON "_rental_settings_v" USING btree ("published_locale");
  CREATE INDEX "_rental_settings_v_latest_idx" ON "_rental_settings_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_rental_settings_v_locales_locale_parent_id_unique" ON "_rental_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_trust_features_order_idx" ON "home_page_trust_features" USING btree ("_order");
  CREATE INDEX "home_page_trust_features_parent_id_idx" ON "home_page_trust_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_trust_features_locales_locale_parent_id_unique" ON "home_page_trust_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hospitality_features_order_idx" ON "home_page_hospitality_features" USING btree ("_order");
  CREATE INDEX "home_page_hospitality_features_parent_id_idx" ON "home_page_hospitality_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_hospitality_features_locales_locale_parent_id_uniq" ON "home_page_hospitality_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_hero_mobile_image_idx" ON "home_page" USING btree ("hero_mobile_image_id");
  CREATE INDEX "home_page_trust_image_idx" ON "home_page" USING btree ("trust_image_id");
  CREATE INDEX "home_page_hospitality_image_idx" ON "home_page" USING btree ("hospitality_image_id");
  CREATE INDEX "home_page_seo_seo_og_image_idx" ON "home_page" USING btree ("seo_og_image_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_trust_features_order_idx" ON "_home_page_v_version_trust_features" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_trust_features_parent_id_idx" ON "_home_page_v_version_trust_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_trust_features_locales_locale_parent_id" ON "_home_page_v_version_trust_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_hospitality_features_order_idx" ON "_home_page_v_version_hospitality_features" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hospitality_features_parent_id_idx" ON "_home_page_v_version_hospitality_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_hospitality_features_locales_locale_par" ON "_home_page_v_version_hospitality_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_version_hero_image_idx" ON "_home_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_page_v_version_version_hero_mobile_image_idx" ON "_home_page_v" USING btree ("version_hero_mobile_image_id");
  CREATE INDEX "_home_page_v_version_version_trust_image_idx" ON "_home_page_v" USING btree ("version_trust_image_id");
  CREATE INDEX "_home_page_v_version_version_hospitality_image_idx" ON "_home_page_v" USING btree ("version_hospitality_image_id");
  CREATE INDEX "_home_page_v_version_seo_version_seo_og_image_idx" ON "_home_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "properties_page_seo_seo_og_image_idx" ON "properties_page" USING btree ("seo_og_image_id");
  CREATE INDEX "properties_page__status_idx" ON "properties_page" USING btree ("_status");
  CREATE UNIQUE INDEX "properties_page_locales_locale_parent_id_unique" ON "properties_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_properties_page_v_version_seo_version_seo_og_image_idx" ON "_properties_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_properties_page_v_version_version__status_idx" ON "_properties_page_v" USING btree ("version__status");
  CREATE INDEX "_properties_page_v_created_at_idx" ON "_properties_page_v" USING btree ("created_at");
  CREATE INDEX "_properties_page_v_updated_at_idx" ON "_properties_page_v" USING btree ("updated_at");
  CREATE INDEX "_properties_page_v_snapshot_idx" ON "_properties_page_v" USING btree ("snapshot");
  CREATE INDEX "_properties_page_v_published_locale_idx" ON "_properties_page_v" USING btree ("published_locale");
  CREATE INDEX "_properties_page_v_latest_idx" ON "_properties_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_properties_page_v_locales_locale_parent_id_unique" ON "_properties_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_image_idx" ON "about_page" USING btree ("image_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_version_version_image_idx" ON "_about_page_v" USING btree ("version_image_id");
  CREATE INDEX "_about_page_v_version_seo_version_seo_og_image_idx" ON "_about_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_snapshot_idx" ON "_about_page_v" USING btree ("snapshot");
  CREATE INDEX "_about_page_v_published_locale_idx" ON "_about_page_v" USING btree ("published_locale");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_about_page_v_locales_locale_parent_id_unique" ON "_about_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "property_management_page_image_idx" ON "property_management_page" USING btree ("image_id");
  CREATE INDEX "property_management_page_seo_seo_og_image_idx" ON "property_management_page" USING btree ("seo_og_image_id");
  CREATE INDEX "property_management_page__status_idx" ON "property_management_page" USING btree ("_status");
  CREATE UNIQUE INDEX "property_management_page_locales_locale_parent_id_unique" ON "property_management_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_property_management_page_v_version_version_image_idx" ON "_property_management_page_v" USING btree ("version_image_id");
  CREATE INDEX "_property_management_page_v_version_seo_version_seo_og_i_idx" ON "_property_management_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_property_management_page_v_version_version__status_idx" ON "_property_management_page_v" USING btree ("version__status");
  CREATE INDEX "_property_management_page_v_created_at_idx" ON "_property_management_page_v" USING btree ("created_at");
  CREATE INDEX "_property_management_page_v_updated_at_idx" ON "_property_management_page_v" USING btree ("updated_at");
  CREATE INDEX "_property_management_page_v_snapshot_idx" ON "_property_management_page_v" USING btree ("snapshot");
  CREATE INDEX "_property_management_page_v_published_locale_idx" ON "_property_management_page_v" USING btree ("published_locale");
  CREATE INDEX "_property_management_page_v_latest_idx" ON "_property_management_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_property_management_page_v_locales_locale_parent_id_unique" ON "_property_management_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_image_idx" ON "contact_page" USING btree ("image_id");
  CREATE INDEX "contact_page_seo_seo_og_image_idx" ON "contact_page" USING btree ("seo_og_image_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_contact_page_v_version_version_image_idx" ON "_contact_page_v" USING btree ("version_image_id");
  CREATE INDEX "_contact_page_v_version_seo_version_seo_og_image_idx" ON "_contact_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "properties_gallery" CASCADE;
  DROP TABLE "properties_extra_facts" CASCADE;
  DROP TABLE "properties_amenity_groups_items" CASCADE;
  DROP TABLE "properties_amenity_groups" CASCADE;
  DROP TABLE "properties_amenity_groups_locales" CASCADE;
  DROP TABLE "properties_external_listings" CASCADE;
  DROP TABLE "properties" CASCADE;
  DROP TABLE "properties_locales" CASCADE;
  DROP TABLE "_properties_v_version_gallery" CASCADE;
  DROP TABLE "_properties_v_version_extra_facts" CASCADE;
  DROP TABLE "_properties_v_version_amenity_groups_items" CASCADE;
  DROP TABLE "_properties_v_version_amenity_groups" CASCADE;
  DROP TABLE "_properties_v_version_amenity_groups_locales" CASCADE;
  DROP TABLE "_properties_v_version_external_listings" CASCADE;
  DROP TABLE "_properties_v" CASCADE;
  DROP TABLE "_properties_v_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "reviews_locales" CASCADE;
  DROP TABLE "_reviews_v" CASCADE;
  DROP TABLE "_reviews_v_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP TABLE "rental_settings_marketplace_links" CASCADE;
  DROP TABLE "rental_settings" CASCADE;
  DROP TABLE "rental_settings_locales" CASCADE;
  DROP TABLE "_rental_settings_v_version_marketplace_links" CASCADE;
  DROP TABLE "_rental_settings_v" CASCADE;
  DROP TABLE "_rental_settings_v_locales" CASCADE;
  DROP TABLE "home_page_trust_features" CASCADE;
  DROP TABLE "home_page_trust_features_locales" CASCADE;
  DROP TABLE "home_page_hospitality_features" CASCADE;
  DROP TABLE "home_page_hospitality_features_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "_home_page_v_version_trust_features" CASCADE;
  DROP TABLE "_home_page_v_version_trust_features_locales" CASCADE;
  DROP TABLE "_home_page_v_version_hospitality_features" CASCADE;
  DROP TABLE "_home_page_v_version_hospitality_features_locales" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "properties_page" CASCADE;
  DROP TABLE "properties_page_locales" CASCADE;
  DROP TABLE "_properties_page_v" CASCADE;
  DROP TABLE "_properties_page_v_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_about_page_v_locales" CASCADE;
  DROP TABLE "property_management_page" CASCADE;
  DROP TABLE "property_management_page_locales" CASCADE;
  DROP TABLE "_property_management_page_v" CASCADE;
  DROP TABLE "_property_management_page_v_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TABLE "_contact_page_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_properties_external_listings_platform";
  DROP TYPE "public"."enum_properties_region";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum__properties_v_version_external_listings_platform";
  DROP TYPE "public"."enum__properties_v_version_region";
  DROP TYPE "public"."enum__properties_v_version_status";
  DROP TYPE "public"."enum__properties_v_published_locale";
  DROP TYPE "public"."enum_reviews_platform";
  DROP TYPE "public"."enum_reviews_status";
  DROP TYPE "public"."enum__reviews_v_version_platform";
  DROP TYPE "public"."enum__reviews_v_version_status";
  DROP TYPE "public"."enum__reviews_v_published_locale";
  DROP TYPE "public"."enum_leads_locale";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";
  DROP TYPE "public"."enum_rental_settings_marketplace_links_platform";
  DROP TYPE "public"."enum_rental_settings_status";
  DROP TYPE "public"."enum__rental_settings_v_version_marketplace_links_platform";
  DROP TYPE "public"."enum__rental_settings_v_version_status";
  DROP TYPE "public"."enum__rental_settings_v_published_locale";
  DROP TYPE "public"."enum_home_page_trust_features_icon";
  DROP TYPE "public"."enum_home_page_hospitality_features_icon";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_trust_features_icon";
  DROP TYPE "public"."enum__home_page_v_version_hospitality_features_icon";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum__home_page_v_published_locale";
  DROP TYPE "public"."enum_properties_page_status";
  DROP TYPE "public"."enum__properties_page_v_version_status";
  DROP TYPE "public"."enum__properties_page_v_published_locale";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum__about_page_v_published_locale";
  DROP TYPE "public"."enum_property_management_page_status";
  DROP TYPE "public"."enum__property_management_page_v_version_status";
  DROP TYPE "public"."enum__property_management_page_v_published_locale";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_status";
  DROP TYPE "public"."enum__contact_page_v_published_locale";`)
}
