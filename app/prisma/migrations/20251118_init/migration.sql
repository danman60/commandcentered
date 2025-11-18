-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "commandcentered";

-- CreateEnum
CREATE TYPE "commandcentered"."user_role" AS ENUM ('SUPER_ADMIN', 'COMPETITION_DIRECTOR', 'STUDIO_DIRECTOR', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "commandcentered"."event_type" AS ENUM ('dance_competition', 'recital', 'concert', 'play', 'other');

-- CreateEnum
CREATE TYPE "commandcentered"."event_status" AS ENUM ('confirmed', 'scheduled', 'in_progress', 'completed', 'archived', 'cancelled', 'pending_questionnaire', 'planning', 'booked', 'tentative', 'proposal');

-- CreateEnum
CREATE TYPE "commandcentered"."operator_role" AS ENUM ('videographer', 'photographer', 'director', 'assistant', 'other');

-- CreateEnum
CREATE TYPE "commandcentered"."pay_type" AS ENUM ('hourly', 'flat');

-- CreateEnum
CREATE TYPE "commandcentered"."shift_assignment_status" AS ENUM ('assigned', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "commandcentered"."conflict_level" AS ENUM ('none', 'caution', 'impossible');

-- CreateEnum
CREATE TYPE "commandcentered"."operator_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "commandcentered"."skill_type" AS ENUM ('videography', 'photography', 'directing', 'professionalism');

-- CreateEnum
CREATE TYPE "commandcentered"."request_status" AS ENUM ('requested', 'confirmed', 'declined', 'cancelled');

-- CreateEnum
CREATE TYPE "commandcentered"."gear_category" AS ENUM ('camera', 'lens', 'audio', 'computer', 'rigging', 'cable', 'lighting', 'accessories', 'stabilizers', 'drones', 'monitors', 'other');

-- CreateEnum
CREATE TYPE "commandcentered"."gear_status" AS ENUM ('available', 'in_use', 'needs_repair', 'in_repair', 'retired', 'unavailable', 'out_of_service');

-- CreateEnum
CREATE TYPE "commandcentered"."pack_status" AS ENUM ('needs_packing', 'packed', 'at_event', 'returned');

-- CreateEnum
CREATE TYPE "commandcentered"."vehicle_status" AS ENUM ('available', 'in_use', 'out_of_service', 'in_repair');

-- CreateEnum
CREATE TYPE "commandcentered"."deliverable_status" AS ENUM ('not_started', 'in_progress', 'in_review', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "commandcentered"."bounty_status" AS ENUM ('open', 'claimed', 'completed', 'paid', 'expired');

-- CreateEnum
CREATE TYPE "commandcentered"."priority" AS ENUM ('low', 'normal', 'high', 'urgent', 'critical');

-- CreateEnum
CREATE TYPE "commandcentered"."action_status" AS ENUM ('pending', 'in_progress', 'completed', 'ignored');

-- CreateEnum
CREATE TYPE "commandcentered"."revision_status" AS ENUM ('pending', 'in_progress', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "commandcentered"."alert_level" AS ENUM ('critical', 'high', 'warning', 'medium', 'info', 'low');

-- CreateEnum
CREATE TYPE "commandcentered"."lead_status" AS ENUM ('new', 'contacted', 'qualified', 'proposal_sent', 'proposal_viewed', 'engaged', 'proposal_submitted', 'contract_sent', 'converted', 'lost', 'disqualified');

-- CreateEnum
CREATE TYPE "commandcentered"."proposal_status" AS ENUM ('submitted', 'reviewing', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "commandcentered"."contract_status" AS ENUM ('draft', 'sent', 'signed', 'cancelled');

-- CreateEnum
CREATE TYPE "commandcentered"."signature_status" AS ENUM ('pending', 'sent', 'viewed', 'signed', 'declined');

-- CreateEnum
CREATE TYPE "commandcentered"."invoice_status" AS ENUM ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "commandcentered"."payment_status" AS ENUM ('pending', 'succeeded', 'failed', 'refunded', 'disputed');

-- CreateEnum
CREATE TYPE "commandcentered"."schedule_status" AS ENUM ('pending', 'due', 'paid', 'overdue', 'waived');

-- CreateEnum
CREATE TYPE "commandcentered"."client_status" AS ENUM ('active', 'inactive', 'blacklisted');

-- CreateEnum
CREATE TYPE "commandcentered"."questionnaire_status" AS ENUM ('pending', 'sent', 'partial', 'completed');

-- CreateEnum
CREATE TYPE "commandcentered"."email_status" AS ENUM ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained');

-- CreateEnum
CREATE TYPE "commandcentered"."folder_status" AS ENUM ('active', 'archived', 'deleted');

-- CreateEnum
CREATE TYPE "commandcentered"."integration_status" AS ENUM ('pending', 'success', 'failed', 'retrying');

-- CreateEnum
CREATE TYPE "commandcentered"."product_status" AS ENUM ('not_interested', 'discussing', 'proposal', 'won', 'lost');

-- CreateEnum
CREATE TYPE "commandcentered"."touchpoint_type" AS ENUM ('initial_contact', 'proposal_sent', 'contract_sent', 'contract_signed', 'questionnaire_sent', 'questionnaire_completed', 'invoice_sent', 'invoice_paid', 'pre_event_reminder', 'post_event_followup', 'rebooking_outreach');

-- CreateEnum
CREATE TYPE "commandcentered"."touchpoint_status" AS ENUM ('pending', 'scheduled', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "commandcentered"."automated_email_type" AS ENUM ('show_program_reminder', 'rebooking_followup', 'contract_reminder', 'questionnaire_reminder', 'payment_reminder', 'delivery_notification', 'thank_you_feedback');

-- CreateTable
CREATE TABLE "commandcentered"."tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "subdomain" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."user_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "role" "commandcentered"."user_role" NOT NULL DEFAULT 'OPERATOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_type" "commandcentered"."event_type" NOT NULL,
    "venue_name" TEXT NOT NULL,
    "venue_address" TEXT NOT NULL,
    "venue_lat" DECIMAL(10,8),
    "venue_lng" DECIMAL(11,8),
    "parking_instructions" TEXT,
    "client_name" TEXT,
    "client_email" TEXT,
    "client_phone" TEXT,
    "client_id" UUID,
    "load_in_time" TIMESTAMP(3) NOT NULL,
    "load_out_time" TIMESTAMP(3) NOT NULL,
    "revenue_amount" DECIMAL(10,2),
    "actual_revenue" DECIMAL(10,2),
    "cancellation_penalty" DECIMAL(10,2),
    "cancellation_reason" TEXT,
    "has_hotel" BOOLEAN NOT NULL DEFAULT false,
    "hotel_name" TEXT,
    "hotel_address" TEXT,
    "hotel_lat" DECIMAL(10,8),
    "hotel_lng" DECIMAL(11,8),
    "hotel_check_in_date" TIMESTAMP(3),
    "hotel_check_in_time" TIME,
    "hotel_check_out_date" TIMESTAMP(3),
    "hotel_notes" TEXT,
    "telegram_group_id" TEXT,
    "telegram_invite_link" TEXT,
    "telegram_group_created_at" TIMESTAMP(3),
    "contract_id" UUID,
    "created_from_contract" BOOLEAN NOT NULL DEFAULT false,
    "auto_created" BOOLEAN NOT NULL DEFAULT false,
    "google_drive_folder_id" VARCHAR(255),
    "google_drive_folder_url" VARCHAR(500),
    "vimeo_event_id" VARCHAR(255),
    "stream_key" VARCHAR(255),
    "rtmp_url" VARCHAR(500),
    "embed_code" TEXT,
    "livestream_url" VARCHAR(500),
    "status" "commandcentered"."event_status" NOT NULL DEFAULT 'confirmed',
    "is_multi_day" BOOLEAN NOT NULL DEFAULT false,
    "special_notes" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."shifts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "shift_name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_overlap_shift" BOOLEAN NOT NULL DEFAULT false,
    "roles_needed" JSONB,
    "notes" TEXT,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."shift_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "role" "commandcentered"."operator_role" NOT NULL,
    "pay_type" "commandcentered"."pay_type" NOT NULL DEFAULT 'hourly',
    "hourly_rate" DECIMAL(10,2),
    "estimated_hours" DECIMAL(5,2),
    "actual_hours" DECIMAL(5,2),
    "flat_rate" DECIMAL(10,2),
    "calculated_pay" DECIMAL(10,2) NOT NULL,
    "needs_ride" BOOLEAN NOT NULL DEFAULT false,
    "ride_provider_id" UUID,
    "travel_time_to_shift_minutes" INTEGER,
    "travel_time_from_previous_shift_minutes" INTEGER,
    "hotel_needed" BOOLEAN NOT NULL DEFAULT false,
    "hotel_opted_in" BOOLEAN NOT NULL DEFAULT false,
    "status" "commandcentered"."shift_assignment_status" NOT NULL DEFAULT 'confirmed',
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "replacement_assignment_id" UUID,
    "conflict_level" "commandcentered"."conflict_level" NOT NULL DEFAULT 'none',
    "conflict_override_reason" TEXT,
    "actual_hours_updated_at" TIMESTAMP(3),
    "actual_hours_updated_by" UUID,
    "actual_hours_notes" TEXT,
    "notes" TEXT,

    CONSTRAINT "shift_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operators" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" TEXT,
    "hourly_rate" DECIMAL(10,2) NOT NULL,
    "accepts_flat_rate" BOOLEAN NOT NULL DEFAULT true,
    "has_vehicle" BOOLEAN NOT NULL DEFAULT false,
    "vehicle_description" TEXT,
    "home_address" TEXT,
    "home_lat" DECIMAL(10,8),
    "home_lng" DECIMAL(11,8),
    "status" "commandcentered"."operator_status" NOT NULL DEFAULT 'active',

    CONSTRAINT "operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_blackout_dates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "operator_blackout_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "skill_definition_id" UUID NOT NULL,
    "skill_level" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "operator_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_skill_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "skill_type" "commandcentered"."skill_type" NOT NULL,
    "old_value" INTEGER NOT NULL,
    "new_value" INTEGER NOT NULL,
    "reason" TEXT,
    "drill_id" UUID,
    "updated_by" UUID,

    CONSTRAINT "operator_skill_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_gear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "commandcentered"."gear_category" NOT NULL,
    "type" TEXT NOT NULL,
    "status" "commandcentered"."gear_status" NOT NULL DEFAULT 'available',
    "notes" TEXT,

    CONSTRAINT "operator_gear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_gear_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "operator_gear_id" UUID NOT NULL,
    "request_status" "commandcentered"."request_status" NOT NULL DEFAULT 'requested',
    "is_borrowing" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "operator_gear_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."skill_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "skill_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skill_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."drills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "drill_name" TEXT NOT NULL,
    "drill_type" TEXT NOT NULL,
    "drill_date" DATE NOT NULL,
    "duration_hours" DECIMAL(4,2),
    "skill_increase" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,

    CONSTRAINT "drills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."drill_attendees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "drill_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT true,
    "skill_upgraded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "drill_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."drill_agenda_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "drill_id" UUID NOT NULL,
    "item_name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "drill_agenda_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."gear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "commandcentered"."gear_category" NOT NULL,
    "type" TEXT NOT NULL,
    "serial_number" TEXT,
    "purchase_date" DATE,
    "purchase_price" DECIMAL(10,2),
    "status" "commandcentered"."gear_status" NOT NULL DEFAULT 'available',
    "notes" TEXT,

    CONSTRAINT "gear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."gear_movement_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "gear_id" UUID NOT NULL,
    "from_location" TEXT NOT NULL,
    "to_location" TEXT NOT NULL,
    "moved_by" UUID,
    "reason" TEXT,
    "notes" TEXT,

    CONSTRAINT "gear_movement_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."gear_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "gear_id" UUID NOT NULL,
    "vehicle_id" UUID,
    "kit_id" UUID,
    "shift_id" UUID,
    "pack_status" "commandcentered"."pack_status" NOT NULL DEFAULT 'needs_packing',
    "broken_during_event" BOOLEAN NOT NULL DEFAULT false,
    "needs_retrieval" BOOLEAN NOT NULL DEFAULT false,
    "retrieved_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "gear_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."vehicles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "license_plate" TEXT,
    "status" "commandcentered"."vehicle_status" NOT NULL DEFAULT 'available',
    "out_of_service_at" TIMESTAMP(3),
    "out_of_service_reason" TEXT,
    "notes" TEXT,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."gear_kits" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "kit_name" TEXT NOT NULL,
    "description" TEXT,
    "gear_ids" UUID[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "gear_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."deliverables" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "deliverable_type" TEXT NOT NULL,
    "deliverable_name" TEXT NOT NULL,
    "due_date" DATE NOT NULL,
    "total_assets" INTEGER NOT NULL DEFAULT 0,
    "completed_assets" INTEGER NOT NULL DEFAULT 0,
    "assigned_editor_id" UUID,
    "status" "commandcentered"."deliverable_status" NOT NULL DEFAULT 'not_started',
    "priority" "commandcentered"."priority" NOT NULL DEFAULT 'normal',
    "notes" TEXT,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."deliverable_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "deliverable_id" UUID NOT NULL,
    "asset_name" TEXT NOT NULL,
    "asset_type" TEXT,
    "file_path" TEXT,
    "file_size_mb" DECIMAL(10,2),
    "duration_seconds" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "assigned_editor_id" UUID,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "deliverable_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."editors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" TEXT,
    "specialties" TEXT[],
    "hourly_rate" DECIMAL(10,2),
    "flat_rate_per_project" DECIMAL(10,2),
    "max_concurrent_projects" INTEGER NOT NULL DEFAULT 3,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "editors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."bounties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "deliverable_id" UUID,
    "deliverable_asset_id" UUID,
    "bounty_type" TEXT NOT NULL,
    "bounty_amount" DECIMAL(10,2) NOT NULL,
    "bounty_criteria" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "claimed_by" UUID,
    "claimed_at" TIMESTAMP(3),
    "bounty_status" "commandcentered"."bounty_status" NOT NULL DEFAULT 'open',
    "completed_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "bounties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."client_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "email_from" TEXT,
    "email_subject" TEXT,
    "email_received_at" TIMESTAMP(3),
    "priority" "commandcentered"."priority" NOT NULL DEFAULT 'normal',
    "is_action_required" BOOLEAN NOT NULL DEFAULT false,
    "action_status" "commandcentered"."action_status" NOT NULL DEFAULT 'pending',
    "created_by" UUID,

    CONSTRAINT "client_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."deliverable_revision_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "deliverable_id" UUID,
    "deliverable_asset_id" UUID,
    "revision_type" TEXT NOT NULL,
    "requested_by" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revision_notes" TEXT NOT NULL,
    "assigned_editor_id" UUID,
    "status" "commandcentered"."revision_status" NOT NULL DEFAULT 'pending',
    "completed_at" TIMESTAMP(3),
    "resolution_notes" TEXT,

    CONSTRAINT "deliverable_revision_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID,
    "level" "commandcentered"."alert_level" NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "acknowledged_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "related_entity_type" VARCHAR(50),
    "related_entity_id" UUID,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."alert_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "alert_type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "delivery_method" TEXT NOT NULL DEFAULT 'in_app',

    CONSTRAINT "alert_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "organization" VARCHAR(255),
    "phone" VARCHAR(50),
    "contact_name" VARCHAR(255),
    "source" VARCHAR(100),
    "source_details" TEXT,
    "status" "commandcentered"."lead_status" NOT NULL DEFAULT 'new',
    "status_reason" TEXT,
    "assigned_to" UUID,
    "last_contacted_at" TIMESTAMP(3),
    "next_follow_up_at" TIMESTAMP(3),
    "type_of_contact" VARCHAR(50),
    "contact_frequency" VARCHAR(50),
    "product_service" VARCHAR(100),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."lead_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "note" TEXT NOT NULL,
    "created_by" UUID,

    CONSTRAINT "lead_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."proposal_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "service_type" VARCHAR(100),
    "description" TEXT,
    "config_json" JSONB NOT NULL DEFAULT '{}',
    "published_at" TIMESTAMP(3),
    "published_url" VARCHAR(500),
    "created_by" UUID,

    CONSTRAINT "proposal_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."proposals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "lead_id" UUID,
    "template_id" UUID NOT NULL,
    "selections_json" JSONB NOT NULL DEFAULT '{}',
    "event_date" DATE,
    "event_start_time" TIME,
    "event_venue" VARCHAR(255),
    "event_notes" TEXT,
    "subtotal_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'CAD',
    "status" "commandcentered"."proposal_status" NOT NULL DEFAULT 'submitted',
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" UUID,
    "review_notes" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."proposal_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposal_id" UUID NOT NULL,
    "service_name" VARCHAR(255) NOT NULL,
    "service_description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(100),
    "tenantId" UUID,

    CONSTRAINT "proposal_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."contracts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "proposal_id" UUID NOT NULL,
    "lead_id" UUID,
    "client_id" UUID,
    "contract_number" VARCHAR(100) NOT NULL,
    "contract_template_id" UUID,
    "contract_text" TEXT NOT NULL,
    "contract_pdf_url" VARCHAR(500),
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'CAD',
    "deposit_amount" DECIMAL(10,2),
    "payment_terms" TEXT,
    "status" "commandcentered"."contract_status" NOT NULL DEFAULT 'draft',
    "sent_at" TIMESTAMP(3),
    "signed_at" TIMESTAMP(3),
    "event_id" UUID,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."contract_signatures" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contract_id" UUID NOT NULL,
    "signer_email" VARCHAR(255) NOT NULL,
    "signer_name" VARCHAR(255),
    "signer_role" VARCHAR(100),
    "signature_data" TEXT,
    "signature_ip" VARCHAR(100),
    "signature_timestamp" TIMESTAMP(3),
    "status" "commandcentered"."signature_status" NOT NULL DEFAULT 'pending',
    "request_sent_at" TIMESTAMP(3),
    "last_reminded_at" TIMESTAMP(3),
    "reminder_count" INTEGER NOT NULL DEFAULT 0,
    "tenantId" UUID,

    CONSTRAINT "contract_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."invoices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contract_id" UUID,
    "lead_id" UUID,
    "invoice_number" VARCHAR(100) NOT NULL,
    "invoice_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" DATE NOT NULL,
    "subtotal_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'CAD',
    "status" "commandcentered"."invoice_status" NOT NULL DEFAULT 'draft',
    "sent_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "stripe_invoice_id" VARCHAR(255),
    "payment_link_url" VARCHAR(500),
    "notes" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."invoice_line_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_id" UUID NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(100),
    "tenantId" UUID,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'CAD',
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" VARCHAR(50),
    "stripe_payment_intent_id" VARCHAR(255),
    "stripe_charge_id" VARCHAR(255),
    "stripe_payment_method_id" VARCHAR(255),
    "status" "commandcentered"."payment_status" NOT NULL DEFAULT 'pending',
    "failure_reason" TEXT,
    "refund_amount" DECIMAL(10,2) DEFAULT 0,
    "refunded_at" TIMESTAMP(3),
    "refund_reason" TEXT,
    "notes" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."payment_schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "invoice_id" UUID,
    "milestone_name" VARCHAR(255) NOT NULL,
    "milestone_description" TEXT,
    "due_date" DATE,
    "due_trigger" VARCHAR(100),
    "amount" DECIMAL(10,2) NOT NULL,
    "amount_type" VARCHAR(50) NOT NULL,
    "percentage" DECIMAL(5,2),
    "status" "commandcentered"."schedule_status" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."clients" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "lead_id" UUID,
    "organization" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "website" VARCHAR(500),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100) DEFAULT 'Canada',
    "industry" VARCHAR(100),
    "size" VARCHAR(50),
    "status" "commandcentered"."client_status" NOT NULL DEFAULT 'active',
    "status_notes" TEXT,
    "total_revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_events" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."client_questionnaires" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "questionnaire_template_id" UUID,
    "questions_json" JSONB NOT NULL,
    "responses_json" JSONB,
    "status" "commandcentered"."questionnaire_status" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "reminder_sent_at" TIMESTAMP(3),
    "reminder_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "client_questionnaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."email_tracking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "related_entity_type" VARCHAR(100),
    "related_entity_id" UUID,
    "email_provider_id" VARCHAR(255) NOT NULL,
    "to_email" VARCHAR(255) NOT NULL,
    "from_email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "body_text" TEXT,
    "body_html" TEXT,
    "template_name" VARCHAR(255),
    "template_variables" JSONB,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_at" TIMESTAMP(3),
    "clicked_at" TIMESTAMP(3),
    "bounced_at" TIMESTAMP(3),
    "bounce_reason" TEXT,
    "complained_at" TIMESTAMP(3),
    "status" "commandcentered"."email_status" NOT NULL DEFAULT 'sent',

    CONSTRAINT "email_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."crm_organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "website" VARCHAR(500),
    "phone" VARCHAR(50),
    "email" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100) DEFAULT 'Canada',
    "organization_type" VARCHAR(100),
    "size" VARCHAR(50),
    "studio_promo_status" VARCHAR(100),
    "recital_status" VARCHAR(100),
    "studio_sage_status" VARCHAR(100),
    "last_contacted_at" DATE,
    "next_follow_up_at" DATE,
    "contact_frequency" VARCHAR(50),
    "notes" TEXT,

    CONSTRAINT "crm_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."crm_contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "linkedin_url" VARCHAR(500),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "crm_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."crm_interactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "contact_id" UUID,
    "user_id" UUID,
    "interaction_type" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(500),
    "notes" TEXT,
    "outcome" VARCHAR(100),
    "requires_follow_up" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" DATE,
    "follow_up_notes" TEXT,
    "interaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crm_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."google_drive_folders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "related_entity_type" VARCHAR(100) NOT NULL,
    "related_entity_id" UUID NOT NULL,
    "folder_id" VARCHAR(255) NOT NULL,
    "folder_name" VARCHAR(255) NOT NULL,
    "folder_url" VARCHAR(500) NOT NULL,
    "shared_with_emails" TEXT[],
    "permission_level" VARCHAR(50) NOT NULL DEFAULT 'writer',
    "status" "commandcentered"."folder_status" NOT NULL DEFAULT 'active',

    CONSTRAINT "google_drive_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."service_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "default_duration_hours" INTEGER NOT NULL,
    "default_price" DECIMAL(10,2) NOT NULL,
    "default_operator_count" INTEGER NOT NULL,
    "deliverable_types" TEXT[],
    "event_type" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "service_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."operator_availability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "operator_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "available_type" VARCHAR(20) NOT NULL DEFAULT 'full_day',
    "notes" TEXT,

    CONSTRAINT "operator_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."magic_links" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "use_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "magic_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."system_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "stripe_publishable_key" VARCHAR(500),
    "stripe_secret_key" VARCHAR(500),
    "stripe_webhook_secret" VARCHAR(500),
    "email_provider" VARCHAR(50),
    "email_api_key" VARCHAR(500),
    "email_from_address" VARCHAR(255),
    "email_from_name" VARCHAR(255),
    "google_drive_enabled" BOOLEAN NOT NULL DEFAULT false,
    "google_drive_parent_folder_id" VARCHAR(255),
    "google_drive_credentials" JSONB,
    "company_name" VARCHAR(255),
    "company_logo_url" VARCHAR(500),
    "primary_color" VARCHAR(7),
    "secondary_color" VARCHAR(7),

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."integration_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" UUID NOT NULL,
    "integration_type" VARCHAR(50) NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "status" "commandcentered"."integration_status" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "metadata" JSONB,
    "request_data" JSONB,
    "response_data" JSONB,
    "processing_time_ms" INTEGER,

    CONSTRAINT "integration_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."shift_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "template_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "event_type" "commandcentered"."event_type",
    "shifts_config" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "shift_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."lead_products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "is_interested" BOOLEAN NOT NULL DEFAULT false,
    "status" "commandcentered"."product_status" NOT NULL DEFAULT 'not_interested',
    "revenue_amount" DECIMAL(10,2),
    "notes" TEXT,

    CONSTRAINT "lead_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."dashboard_widget_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "widget_type" VARCHAR(50) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "position" JSONB,
    "size" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dashboard_widget_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."communication_touchpoints" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "lead_id" UUID,
    "client_id" UUID,
    "event_id" UUID,
    "touchpoint_type" "commandcentered"."touchpoint_type" NOT NULL,
    "status" "commandcentered"."touchpoint_status" NOT NULL DEFAULT 'pending',
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "communication_touchpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."gear_dependencies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "gear_id" UUID NOT NULL,
    "dependent_gear_id" UUID NOT NULL,
    "suggestion_text" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gear_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."event_type_gear_recommendations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_type" "commandcentered"."event_type" NOT NULL,
    "gear_id" UUID NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "suggestion_text" TEXT,

    CONSTRAINT "event_type_gear_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandcentered"."automated_email_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,
    "email_type" "commandcentered"."automated_email_type" NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "bodyTemplate" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "send_delay" INTEGER,

    CONSTRAINT "automated_email_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subdomain_key" ON "commandcentered"."tenants"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_auth_user_id_key" ON "commandcentered"."user_profiles"("auth_user_id");

-- CreateIndex
CREATE INDEX "user_profiles_tenant_id_idx" ON "commandcentered"."user_profiles"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_tenant_id_email_key" ON "commandcentered"."user_profiles"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "events_tenant_id_idx" ON "commandcentered"."events"("tenant_id");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "commandcentered"."events"("status");

-- CreateIndex
CREATE INDEX "events_load_in_time_idx" ON "commandcentered"."events"("load_in_time");

-- CreateIndex
CREATE INDEX "shifts_tenant_id_idx" ON "commandcentered"."shifts"("tenant_id");

-- CreateIndex
CREATE INDEX "shifts_event_id_idx" ON "commandcentered"."shifts"("event_id");

-- CreateIndex
CREATE INDEX "shifts_start_time_idx" ON "commandcentered"."shifts"("start_time");

-- CreateIndex
CREATE INDEX "shift_assignments_tenant_id_idx" ON "commandcentered"."shift_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "shift_assignments_shift_id_idx" ON "commandcentered"."shift_assignments"("shift_id");

-- CreateIndex
CREATE INDEX "shift_assignments_operator_id_idx" ON "commandcentered"."shift_assignments"("operator_id");

-- CreateIndex
CREATE INDEX "shift_assignments_status_idx" ON "commandcentered"."shift_assignments"("status");

-- CreateIndex
CREATE INDEX "shift_assignments_needs_ride_idx" ON "commandcentered"."shift_assignments"("needs_ride");

-- CreateIndex
CREATE INDEX "operators_tenant_id_idx" ON "commandcentered"."operators"("tenant_id");

-- CreateIndex
CREATE INDEX "operators_status_idx" ON "commandcentered"."operators"("status");

-- CreateIndex
CREATE UNIQUE INDEX "operators_tenant_id_email_key" ON "commandcentered"."operators"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "operator_blackout_dates_tenant_id_idx" ON "commandcentered"."operator_blackout_dates"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_blackout_dates_operator_id_idx" ON "commandcentered"."operator_blackout_dates"("operator_id");

-- CreateIndex
CREATE INDEX "operator_blackout_dates_start_date_end_date_idx" ON "commandcentered"."operator_blackout_dates"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "operator_skills_tenant_id_idx" ON "commandcentered"."operator_skills"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_skills_operator_id_idx" ON "commandcentered"."operator_skills"("operator_id");

-- CreateIndex
CREATE INDEX "operator_skills_skill_definition_id_idx" ON "commandcentered"."operator_skills"("skill_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "operator_skills_operator_id_skill_definition_id_key" ON "commandcentered"."operator_skills"("operator_id", "skill_definition_id");

-- CreateIndex
CREATE INDEX "operator_skill_history_tenant_id_idx" ON "commandcentered"."operator_skill_history"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_skill_history_operator_id_idx" ON "commandcentered"."operator_skill_history"("operator_id");

-- CreateIndex
CREATE INDEX "operator_gear_tenant_id_idx" ON "commandcentered"."operator_gear"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_gear_operator_id_idx" ON "commandcentered"."operator_gear"("operator_id");

-- CreateIndex
CREATE INDEX "operator_gear_category_idx" ON "commandcentered"."operator_gear"("category");

-- CreateIndex
CREATE INDEX "operator_gear_status_idx" ON "commandcentered"."operator_gear"("status");

-- CreateIndex
CREATE INDEX "operator_gear_requests_tenant_id_idx" ON "commandcentered"."operator_gear_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_gear_requests_shift_id_idx" ON "commandcentered"."operator_gear_requests"("shift_id");

-- CreateIndex
CREATE INDEX "operator_gear_requests_operator_id_idx" ON "commandcentered"."operator_gear_requests"("operator_id");

-- CreateIndex
CREATE INDEX "operator_gear_requests_request_status_idx" ON "commandcentered"."operator_gear_requests"("request_status");

-- CreateIndex
CREATE INDEX "skill_definitions_tenant_id_idx" ON "commandcentered"."skill_definitions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_definitions_tenant_id_skill_name_key" ON "commandcentered"."skill_definitions"("tenant_id", "skill_name");

-- CreateIndex
CREATE INDEX "drills_tenant_id_idx" ON "commandcentered"."drills"("tenant_id");

-- CreateIndex
CREATE INDEX "drills_drill_date_idx" ON "commandcentered"."drills"("drill_date");

-- CreateIndex
CREATE INDEX "drill_attendees_tenant_id_idx" ON "commandcentered"."drill_attendees"("tenant_id");

-- CreateIndex
CREATE INDEX "drill_attendees_drill_id_idx" ON "commandcentered"."drill_attendees"("drill_id");

-- CreateIndex
CREATE INDEX "drill_attendees_operator_id_idx" ON "commandcentered"."drill_attendees"("operator_id");

-- CreateIndex
CREATE UNIQUE INDEX "drill_attendees_drill_id_operator_id_key" ON "commandcentered"."drill_attendees"("drill_id", "operator_id");

-- CreateIndex
CREATE INDEX "drill_agenda_items_tenant_id_idx" ON "commandcentered"."drill_agenda_items"("tenant_id");

-- CreateIndex
CREATE INDEX "drill_agenda_items_drill_id_idx" ON "commandcentered"."drill_agenda_items"("drill_id");

-- CreateIndex
CREATE INDEX "gear_tenant_id_idx" ON "commandcentered"."gear"("tenant_id");

-- CreateIndex
CREATE INDEX "gear_category_idx" ON "commandcentered"."gear"("category");

-- CreateIndex
CREATE INDEX "gear_status_idx" ON "commandcentered"."gear"("status");

-- CreateIndex
CREATE INDEX "gear_movement_history_tenant_id_idx" ON "commandcentered"."gear_movement_history"("tenant_id");

-- CreateIndex
CREATE INDEX "gear_movement_history_gear_id_idx" ON "commandcentered"."gear_movement_history"("gear_id");

-- CreateIndex
CREATE INDEX "gear_movement_history_created_at_idx" ON "commandcentered"."gear_movement_history"("created_at");

-- CreateIndex
CREATE INDEX "gear_assignments_tenant_id_idx" ON "commandcentered"."gear_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "gear_assignments_event_id_idx" ON "commandcentered"."gear_assignments"("event_id");

-- CreateIndex
CREATE INDEX "gear_assignments_gear_id_idx" ON "commandcentered"."gear_assignments"("gear_id");

-- CreateIndex
CREATE INDEX "gear_assignments_kit_id_idx" ON "commandcentered"."gear_assignments"("kit_id");

-- CreateIndex
CREATE INDEX "gear_assignments_shift_id_idx" ON "commandcentered"."gear_assignments"("shift_id");

-- CreateIndex
CREATE UNIQUE INDEX "gear_assignments_event_id_gear_id_key" ON "commandcentered"."gear_assignments"("event_id", "gear_id");

-- CreateIndex
CREATE INDEX "vehicles_tenant_id_idx" ON "commandcentered"."vehicles"("tenant_id");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "commandcentered"."vehicles"("status");

-- CreateIndex
CREATE INDEX "gear_kits_tenant_id_idx" ON "commandcentered"."gear_kits"("tenant_id");

-- CreateIndex
CREATE INDEX "deliverables_tenant_id_idx" ON "commandcentered"."deliverables"("tenant_id");

-- CreateIndex
CREATE INDEX "deliverables_event_id_idx" ON "commandcentered"."deliverables"("event_id");

-- CreateIndex
CREATE INDEX "deliverables_assigned_editor_id_idx" ON "commandcentered"."deliverables"("assigned_editor_id");

-- CreateIndex
CREATE INDEX "deliverables_due_date_idx" ON "commandcentered"."deliverables"("due_date");

-- CreateIndex
CREATE INDEX "deliverables_status_idx" ON "commandcentered"."deliverables"("status");

-- CreateIndex
CREATE INDEX "deliverable_assets_tenant_id_idx" ON "commandcentered"."deliverable_assets"("tenant_id");

-- CreateIndex
CREATE INDEX "deliverable_assets_deliverable_id_idx" ON "commandcentered"."deliverable_assets"("deliverable_id");

-- CreateIndex
CREATE INDEX "deliverable_assets_assigned_editor_id_idx" ON "commandcentered"."deliverable_assets"("assigned_editor_id");

-- CreateIndex
CREATE INDEX "deliverable_assets_completed_idx" ON "commandcentered"."deliverable_assets"("completed");

-- CreateIndex
CREATE INDEX "editors_tenant_id_idx" ON "commandcentered"."editors"("tenant_id");

-- CreateIndex
CREATE INDEX "editors_is_active_idx" ON "commandcentered"."editors"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "editors_tenant_id_email_key" ON "commandcentered"."editors"("tenant_id", "email");

-- CreateIndex
CREATE INDEX "bounties_tenant_id_idx" ON "commandcentered"."bounties"("tenant_id");

-- CreateIndex
CREATE INDEX "bounties_deliverable_id_idx" ON "commandcentered"."bounties"("deliverable_id");

-- CreateIndex
CREATE INDEX "bounties_deliverable_asset_id_idx" ON "commandcentered"."bounties"("deliverable_asset_id");

-- CreateIndex
CREATE INDEX "bounties_bounty_status_idx" ON "commandcentered"."bounties"("bounty_status");

-- CreateIndex
CREATE INDEX "bounties_claimed_by_idx" ON "commandcentered"."bounties"("claimed_by");

-- CreateIndex
CREATE INDEX "client_notes_tenant_id_idx" ON "commandcentered"."client_notes"("tenant_id");

-- CreateIndex
CREATE INDEX "client_notes_event_id_idx" ON "commandcentered"."client_notes"("event_id");

-- CreateIndex
CREATE INDEX "client_notes_source_idx" ON "commandcentered"."client_notes"("source");

-- CreateIndex
CREATE INDEX "client_notes_is_action_required_idx" ON "commandcentered"."client_notes"("is_action_required");

-- CreateIndex
CREATE INDEX "client_notes_created_at_idx" ON "commandcentered"."client_notes"("created_at" DESC);

-- CreateIndex
CREATE INDEX "deliverable_revision_history_tenant_id_idx" ON "commandcentered"."deliverable_revision_history"("tenant_id");

-- CreateIndex
CREATE INDEX "deliverable_revision_history_deliverable_id_idx" ON "commandcentered"."deliverable_revision_history"("deliverable_id");

-- CreateIndex
CREATE INDEX "deliverable_revision_history_deliverable_asset_id_idx" ON "commandcentered"."deliverable_revision_history"("deliverable_asset_id");

-- CreateIndex
CREATE INDEX "deliverable_revision_history_status_idx" ON "commandcentered"."deliverable_revision_history"("status");

-- CreateIndex
CREATE INDEX "alerts_tenant_id_resolved_at_idx" ON "commandcentered"."alerts"("tenant_id", "resolved_at");

-- CreateIndex
CREATE INDEX "alerts_event_id_idx" ON "commandcentered"."alerts"("event_id");

-- CreateIndex
CREATE INDEX "alerts_level_created_at_idx" ON "commandcentered"."alerts"("level", "created_at");

-- CreateIndex
CREATE INDEX "alert_preferences_tenant_id_idx" ON "commandcentered"."alert_preferences"("tenant_id");

-- CreateIndex
CREATE INDEX "alert_preferences_user_id_idx" ON "commandcentered"."alert_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "alert_preferences_user_id_alert_type_key" ON "commandcentered"."alert_preferences"("user_id", "alert_type");

-- CreateIndex
CREATE INDEX "leads_tenant_id_idx" ON "commandcentered"."leads"("tenant_id");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "commandcentered"."leads"("status");

-- CreateIndex
CREATE INDEX "leads_assigned_to_idx" ON "commandcentered"."leads"("assigned_to");

-- CreateIndex
CREATE INDEX "leads_next_follow_up_at_idx" ON "commandcentered"."leads"("next_follow_up_at");

-- CreateIndex
CREATE INDEX "lead_notes_tenant_id_idx" ON "commandcentered"."lead_notes"("tenant_id");

-- CreateIndex
CREATE INDEX "lead_notes_lead_id_idx" ON "commandcentered"."lead_notes"("lead_id");

-- CreateIndex
CREATE INDEX "proposal_templates_tenant_id_idx" ON "commandcentered"."proposal_templates"("tenant_id");

-- CreateIndex
CREATE INDEX "proposal_templates_tenant_id_slug_idx" ON "commandcentered"."proposal_templates"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "proposal_templates_tenant_id_published_at_idx" ON "commandcentered"."proposal_templates"("tenant_id", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_templates_tenant_id_slug_key" ON "commandcentered"."proposal_templates"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "proposals_tenant_id_idx" ON "commandcentered"."proposals"("tenant_id");

-- CreateIndex
CREATE INDEX "proposals_lead_id_idx" ON "commandcentered"."proposals"("lead_id");

-- CreateIndex
CREATE INDEX "proposals_status_idx" ON "commandcentered"."proposals"("status");

-- CreateIndex
CREATE INDEX "proposals_event_date_idx" ON "commandcentered"."proposals"("event_date");

-- CreateIndex
CREATE INDEX "proposals_reviewed_by_idx" ON "commandcentered"."proposals"("reviewed_by");

-- CreateIndex
CREATE INDEX "proposal_line_items_proposal_id_idx" ON "commandcentered"."proposal_line_items"("proposal_id");

-- CreateIndex
CREATE INDEX "proposal_line_items_category_idx" ON "commandcentered"."proposal_line_items"("category");

-- CreateIndex
CREATE INDEX "contracts_tenant_id_idx" ON "commandcentered"."contracts"("tenant_id");

-- CreateIndex
CREATE INDEX "contracts_proposal_id_idx" ON "commandcentered"."contracts"("proposal_id");

-- CreateIndex
CREATE INDEX "contracts_lead_id_idx" ON "commandcentered"."contracts"("lead_id");

-- CreateIndex
CREATE INDEX "contracts_client_id_idx" ON "commandcentered"."contracts"("client_id");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "commandcentered"."contracts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_tenant_id_contract_number_key" ON "commandcentered"."contracts"("tenant_id", "contract_number");

-- CreateIndex
CREATE INDEX "contract_signatures_contract_id_idx" ON "commandcentered"."contract_signatures"("contract_id");

-- CreateIndex
CREATE INDEX "contract_signatures_status_idx" ON "commandcentered"."contract_signatures"("status");

-- CreateIndex
CREATE INDEX "contract_signatures_signer_email_idx" ON "commandcentered"."contract_signatures"("signer_email");

-- CreateIndex
CREATE INDEX "invoices_tenant_id_idx" ON "commandcentered"."invoices"("tenant_id");

-- CreateIndex
CREATE INDEX "invoices_contract_id_idx" ON "commandcentered"."invoices"("contract_id");

-- CreateIndex
CREATE INDEX "invoices_lead_id_idx" ON "commandcentered"."invoices"("lead_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "commandcentered"."invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_due_date_idx" ON "commandcentered"."invoices"("due_date");

-- CreateIndex
CREATE INDEX "invoices_stripe_invoice_id_idx" ON "commandcentered"."invoices"("stripe_invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_tenant_id_invoice_number_key" ON "commandcentered"."invoices"("tenant_id", "invoice_number");

-- CreateIndex
CREATE INDEX "invoice_line_items_invoice_id_idx" ON "commandcentered"."invoice_line_items"("invoice_id");

-- CreateIndex
CREATE INDEX "payments_tenant_id_idx" ON "commandcentered"."payments"("tenant_id");

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "commandcentered"."payments"("invoice_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "commandcentered"."payments"("status");

-- CreateIndex
CREATE INDEX "payments_stripe_payment_intent_id_idx" ON "commandcentered"."payments"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "payments_stripe_charge_id_idx" ON "commandcentered"."payments"("stripe_charge_id");

-- CreateIndex
CREATE INDEX "payment_schedules_tenant_id_idx" ON "commandcentered"."payment_schedules"("tenant_id");

-- CreateIndex
CREATE INDEX "payment_schedules_contract_id_idx" ON "commandcentered"."payment_schedules"("contract_id");

-- CreateIndex
CREATE INDEX "payment_schedules_invoice_id_idx" ON "commandcentered"."payment_schedules"("invoice_id");

-- CreateIndex
CREATE INDEX "payment_schedules_status_idx" ON "commandcentered"."payment_schedules"("status");

-- CreateIndex
CREATE INDEX "payment_schedules_due_date_idx" ON "commandcentered"."payment_schedules"("due_date");

-- CreateIndex
CREATE INDEX "clients_tenant_id_idx" ON "commandcentered"."clients"("tenant_id");

-- CreateIndex
CREATE INDEX "clients_lead_id_idx" ON "commandcentered"."clients"("lead_id");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "commandcentered"."clients"("status");

-- CreateIndex
CREATE INDEX "client_questionnaires_tenant_id_idx" ON "commandcentered"."client_questionnaires"("tenant_id");

-- CreateIndex
CREATE INDEX "client_questionnaires_contract_id_idx" ON "commandcentered"."client_questionnaires"("contract_id");

-- CreateIndex
CREATE INDEX "client_questionnaires_status_idx" ON "commandcentered"."client_questionnaires"("status");

-- CreateIndex
CREATE INDEX "email_tracking_tenant_id_idx" ON "commandcentered"."email_tracking"("tenant_id");

-- CreateIndex
CREATE INDEX "email_tracking_related_entity_type_related_entity_id_idx" ON "commandcentered"."email_tracking"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "email_tracking_to_email_idx" ON "commandcentered"."email_tracking"("to_email");

-- CreateIndex
CREATE INDEX "email_tracking_email_provider_id_idx" ON "commandcentered"."email_tracking"("email_provider_id");

-- CreateIndex
CREATE INDEX "email_tracking_sent_at_idx" ON "commandcentered"."email_tracking"("sent_at");

-- CreateIndex
CREATE INDEX "crm_organizations_tenant_id_idx" ON "commandcentered"."crm_organizations"("tenant_id");

-- CreateIndex
CREATE INDEX "crm_organizations_organization_type_idx" ON "commandcentered"."crm_organizations"("organization_type");

-- CreateIndex
CREATE INDEX "crm_organizations_next_follow_up_at_idx" ON "commandcentered"."crm_organizations"("next_follow_up_at");

-- CreateIndex
CREATE INDEX "crm_contacts_tenant_id_idx" ON "commandcentered"."crm_contacts"("tenant_id");

-- CreateIndex
CREATE INDEX "crm_contacts_organization_id_idx" ON "commandcentered"."crm_contacts"("organization_id");

-- CreateIndex
CREATE INDEX "crm_contacts_organization_id_is_primary_idx" ON "commandcentered"."crm_contacts"("organization_id", "is_primary");

-- CreateIndex
CREATE INDEX "crm_interactions_tenant_id_idx" ON "commandcentered"."crm_interactions"("tenant_id");

-- CreateIndex
CREATE INDEX "crm_interactions_organization_id_idx" ON "commandcentered"."crm_interactions"("organization_id");

-- CreateIndex
CREATE INDEX "crm_interactions_contact_id_idx" ON "commandcentered"."crm_interactions"("contact_id");

-- CreateIndex
CREATE INDEX "crm_interactions_user_id_idx" ON "commandcentered"."crm_interactions"("user_id");

-- CreateIndex
CREATE INDEX "crm_interactions_interaction_date_idx" ON "commandcentered"."crm_interactions"("interaction_date");

-- CreateIndex
CREATE INDEX "crm_interactions_follow_up_date_idx" ON "commandcentered"."crm_interactions"("follow_up_date");

-- CreateIndex
CREATE INDEX "google_drive_folders_tenant_id_idx" ON "commandcentered"."google_drive_folders"("tenant_id");

-- CreateIndex
CREATE INDEX "google_drive_folders_related_entity_type_related_entity_id_idx" ON "commandcentered"."google_drive_folders"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE INDEX "google_drive_folders_folder_id_idx" ON "commandcentered"."google_drive_folders"("folder_id");

-- CreateIndex
CREATE INDEX "service_templates_tenant_id_idx" ON "commandcentered"."service_templates"("tenant_id");

-- CreateIndex
CREATE INDEX "service_templates_is_active_idx" ON "commandcentered"."service_templates"("is_active");

-- CreateIndex
CREATE INDEX "operator_availability_tenant_id_idx" ON "commandcentered"."operator_availability"("tenant_id");

-- CreateIndex
CREATE INDEX "operator_availability_operator_id_idx" ON "commandcentered"."operator_availability"("operator_id");

-- CreateIndex
CREATE INDEX "operator_availability_date_idx" ON "commandcentered"."operator_availability"("date");

-- CreateIndex
CREATE UNIQUE INDEX "operator_availability_tenant_id_operator_id_date_key" ON "commandcentered"."operator_availability"("tenant_id", "operator_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "magic_links_token_key" ON "commandcentered"."magic_links"("token");

-- CreateIndex
CREATE INDEX "magic_links_tenant_id_idx" ON "commandcentered"."magic_links"("tenant_id");

-- CreateIndex
CREATE INDEX "magic_links_token_idx" ON "commandcentered"."magic_links"("token");

-- CreateIndex
CREATE INDEX "magic_links_client_id_idx" ON "commandcentered"."magic_links"("client_id");

-- CreateIndex
CREATE INDEX "magic_links_expires_at_idx" ON "commandcentered"."magic_links"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_tenant_id_key" ON "commandcentered"."system_settings"("tenant_id");

-- CreateIndex
CREATE INDEX "system_settings_tenant_id_idx" ON "commandcentered"."system_settings"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_logs_tenant_id_idx" ON "commandcentered"."integration_logs"("tenant_id");

-- CreateIndex
CREATE INDEX "integration_logs_integration_type_idx" ON "commandcentered"."integration_logs"("integration_type");

-- CreateIndex
CREATE INDEX "integration_logs_event_type_idx" ON "commandcentered"."integration_logs"("event_type");

-- CreateIndex
CREATE INDEX "integration_logs_entity_type_entity_id_idx" ON "commandcentered"."integration_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "integration_logs_status_idx" ON "commandcentered"."integration_logs"("status");

-- CreateIndex
CREATE INDEX "integration_logs_created_at_idx" ON "commandcentered"."integration_logs"("created_at");

-- CreateIndex
CREATE INDEX "shift_templates_tenant_id_idx" ON "commandcentered"."shift_templates"("tenant_id");

-- CreateIndex
CREATE INDEX "shift_templates_is_active_idx" ON "commandcentered"."shift_templates"("is_active");

-- CreateIndex
CREATE INDEX "lead_products_tenant_id_idx" ON "commandcentered"."lead_products"("tenant_id");

-- CreateIndex
CREATE INDEX "lead_products_lead_id_idx" ON "commandcentered"."lead_products"("lead_id");

-- CreateIndex
CREATE INDEX "lead_products_status_idx" ON "commandcentered"."lead_products"("status");

-- CreateIndex
CREATE UNIQUE INDEX "lead_products_lead_id_product_name_key" ON "commandcentered"."lead_products"("lead_id", "product_name");

-- CreateIndex
CREATE INDEX "dashboard_widget_preferences_tenant_id_idx" ON "commandcentered"."dashboard_widget_preferences"("tenant_id");

-- CreateIndex
CREATE INDEX "dashboard_widget_preferences_user_id_idx" ON "commandcentered"."dashboard_widget_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_widget_preferences_user_id_widget_type_key" ON "commandcentered"."dashboard_widget_preferences"("user_id", "widget_type");

-- CreateIndex
CREATE INDEX "communication_touchpoints_tenant_id_idx" ON "commandcentered"."communication_touchpoints"("tenant_id");

-- CreateIndex
CREATE INDEX "communication_touchpoints_lead_id_idx" ON "commandcentered"."communication_touchpoints"("lead_id");

-- CreateIndex
CREATE INDEX "communication_touchpoints_client_id_idx" ON "commandcentered"."communication_touchpoints"("client_id");

-- CreateIndex
CREATE INDEX "communication_touchpoints_event_id_idx" ON "commandcentered"."communication_touchpoints"("event_id");

-- CreateIndex
CREATE INDEX "communication_touchpoints_touchpoint_type_idx" ON "commandcentered"."communication_touchpoints"("touchpoint_type");

-- CreateIndex
CREATE INDEX "gear_dependencies_tenant_id_idx" ON "commandcentered"."gear_dependencies"("tenant_id");

-- CreateIndex
CREATE INDEX "gear_dependencies_gear_id_idx" ON "commandcentered"."gear_dependencies"("gear_id");

-- CreateIndex
CREATE INDEX "gear_dependencies_dependent_gear_id_idx" ON "commandcentered"."gear_dependencies"("dependent_gear_id");

-- CreateIndex
CREATE UNIQUE INDEX "gear_dependencies_gear_id_dependent_gear_id_key" ON "commandcentered"."gear_dependencies"("gear_id", "dependent_gear_id");

-- CreateIndex
CREATE INDEX "event_type_gear_recommendations_tenant_id_idx" ON "commandcentered"."event_type_gear_recommendations"("tenant_id");

-- CreateIndex
CREATE INDEX "event_type_gear_recommendations_event_type_idx" ON "commandcentered"."event_type_gear_recommendations"("event_type");

-- CreateIndex
CREATE INDEX "event_type_gear_recommendations_gear_id_idx" ON "commandcentered"."event_type_gear_recommendations"("gear_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_type_gear_recommendations_event_type_gear_id_key" ON "commandcentered"."event_type_gear_recommendations"("event_type", "gear_id");

-- CreateIndex
CREATE INDEX "automated_email_configs_tenant_id_idx" ON "commandcentered"."automated_email_configs"("tenant_id");

-- CreateIndex
CREATE INDEX "automated_email_configs_is_active_idx" ON "commandcentered"."automated_email_configs"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "automated_email_configs_tenant_id_email_type_key" ON "commandcentered"."automated_email_configs"("tenant_id", "email_type");

-- AddForeignKey
ALTER TABLE "commandcentered"."user_profiles" ADD CONSTRAINT "user_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."events" ADD CONSTRAINT "events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shifts" ADD CONSTRAINT "shifts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shifts" ADD CONSTRAINT "shifts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "commandcentered"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shift_assignments" ADD CONSTRAINT "shift_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shift_assignments" ADD CONSTRAINT "shift_assignments_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "commandcentered"."shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shift_assignments" ADD CONSTRAINT "shift_assignments_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shift_assignments" ADD CONSTRAINT "shift_assignments_ride_provider_id_fkey" FOREIGN KEY ("ride_provider_id") REFERENCES "commandcentered"."operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operators" ADD CONSTRAINT "operators_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_blackout_dates" ADD CONSTRAINT "operator_blackout_dates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_blackout_dates" ADD CONSTRAINT "operator_blackout_dates_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skills" ADD CONSTRAINT "operator_skills_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skills" ADD CONSTRAINT "operator_skills_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skills" ADD CONSTRAINT "operator_skills_skill_definition_id_fkey" FOREIGN KEY ("skill_definition_id") REFERENCES "commandcentered"."skill_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skill_history" ADD CONSTRAINT "operator_skill_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skill_history" ADD CONSTRAINT "operator_skill_history_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_skill_history" ADD CONSTRAINT "operator_skill_history_drill_id_fkey" FOREIGN KEY ("drill_id") REFERENCES "commandcentered"."drills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear" ADD CONSTRAINT "operator_gear_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear" ADD CONSTRAINT "operator_gear_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear_requests" ADD CONSTRAINT "operator_gear_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear_requests" ADD CONSTRAINT "operator_gear_requests_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "commandcentered"."shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear_requests" ADD CONSTRAINT "operator_gear_requests_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_gear_requests" ADD CONSTRAINT "operator_gear_requests_operator_gear_id_fkey" FOREIGN KEY ("operator_gear_id") REFERENCES "commandcentered"."operator_gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."skill_definitions" ADD CONSTRAINT "skill_definitions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drills" ADD CONSTRAINT "drills_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drill_attendees" ADD CONSTRAINT "drill_attendees_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drill_attendees" ADD CONSTRAINT "drill_attendees_drill_id_fkey" FOREIGN KEY ("drill_id") REFERENCES "commandcentered"."drills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drill_attendees" ADD CONSTRAINT "drill_attendees_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drill_agenda_items" ADD CONSTRAINT "drill_agenda_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."drill_agenda_items" ADD CONSTRAINT "drill_agenda_items_drill_id_fkey" FOREIGN KEY ("drill_id") REFERENCES "commandcentered"."drills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear" ADD CONSTRAINT "gear_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_movement_history" ADD CONSTRAINT "gear_movement_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_movement_history" ADD CONSTRAINT "gear_movement_history_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "commandcentered"."gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "commandcentered"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "commandcentered"."gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "commandcentered"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "commandcentered"."gear_kits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_assignments" ADD CONSTRAINT "gear_assignments_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "commandcentered"."shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."vehicles" ADD CONSTRAINT "vehicles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_kits" ADD CONSTRAINT "gear_kits_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverables" ADD CONSTRAINT "deliverables_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverables" ADD CONSTRAINT "deliverables_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "commandcentered"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverables" ADD CONSTRAINT "deliverables_assigned_editor_id_fkey" FOREIGN KEY ("assigned_editor_id") REFERENCES "commandcentered"."editors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_assets" ADD CONSTRAINT "deliverable_assets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_assets" ADD CONSTRAINT "deliverable_assets_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "commandcentered"."deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_assets" ADD CONSTRAINT "deliverable_assets_assigned_editor_id_fkey" FOREIGN KEY ("assigned_editor_id") REFERENCES "commandcentered"."editors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."editors" ADD CONSTRAINT "editors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."bounties" ADD CONSTRAINT "bounties_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."bounties" ADD CONSTRAINT "bounties_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "commandcentered"."deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."bounties" ADD CONSTRAINT "bounties_deliverable_asset_id_fkey" FOREIGN KEY ("deliverable_asset_id") REFERENCES "commandcentered"."deliverable_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."bounties" ADD CONSTRAINT "bounties_claimed_by_fkey" FOREIGN KEY ("claimed_by") REFERENCES "commandcentered"."editors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."client_notes" ADD CONSTRAINT "client_notes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."client_notes" ADD CONSTRAINT "client_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "commandcentered"."user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_revision_history" ADD CONSTRAINT "deliverable_revision_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_revision_history" ADD CONSTRAINT "deliverable_revision_history_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "commandcentered"."deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_revision_history" ADD CONSTRAINT "deliverable_revision_history_deliverable_asset_id_fkey" FOREIGN KEY ("deliverable_asset_id") REFERENCES "commandcentered"."deliverable_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."deliverable_revision_history" ADD CONSTRAINT "deliverable_revision_history_assigned_editor_id_fkey" FOREIGN KEY ("assigned_editor_id") REFERENCES "commandcentered"."editors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."alerts" ADD CONSTRAINT "alerts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."alerts" ADD CONSTRAINT "alerts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "commandcentered"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."alert_preferences" ADD CONSTRAINT "alert_preferences_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."alert_preferences" ADD CONSTRAINT "alert_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "commandcentered"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."leads" ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."lead_notes" ADD CONSTRAINT "lead_notes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."lead_notes" ADD CONSTRAINT "lead_notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposal_templates" ADD CONSTRAINT "proposal_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposals" ADD CONSTRAINT "proposals_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposals" ADD CONSTRAINT "proposals_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposals" ADD CONSTRAINT "proposals_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "commandcentered"."proposal_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposal_line_items" ADD CONSTRAINT "proposal_line_items_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "commandcentered"."proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."proposal_line_items" ADD CONSTRAINT "proposal_line_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "commandcentered"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contracts" ADD CONSTRAINT "contracts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contracts" ADD CONSTRAINT "contracts_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "commandcentered"."proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contracts" ADD CONSTRAINT "contracts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contracts" ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "commandcentered"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contract_signatures" ADD CONSTRAINT "contract_signatures_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "commandcentered"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."contract_signatures" ADD CONSTRAINT "contract_signatures_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "commandcentered"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."invoices" ADD CONSTRAINT "invoices_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."invoices" ADD CONSTRAINT "invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "commandcentered"."contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."invoices" ADD CONSTRAINT "invoices_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "commandcentered"."invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "commandcentered"."tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."payments" ADD CONSTRAINT "payments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "commandcentered"."invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."payment_schedules" ADD CONSTRAINT "payment_schedules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."payment_schedules" ADD CONSTRAINT "payment_schedules_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "commandcentered"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."payment_schedules" ADD CONSTRAINT "payment_schedules_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "commandcentered"."invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."clients" ADD CONSTRAINT "clients_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."clients" ADD CONSTRAINT "clients_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."client_questionnaires" ADD CONSTRAINT "client_questionnaires_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."client_questionnaires" ADD CONSTRAINT "client_questionnaires_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "commandcentered"."contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."email_tracking" ADD CONSTRAINT "email_tracking_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_organizations" ADD CONSTRAINT "crm_organizations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_contacts" ADD CONSTRAINT "crm_contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_contacts" ADD CONSTRAINT "crm_contacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "commandcentered"."crm_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_interactions" ADD CONSTRAINT "crm_interactions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_interactions" ADD CONSTRAINT "crm_interactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "commandcentered"."crm_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."crm_interactions" ADD CONSTRAINT "crm_interactions_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "commandcentered"."crm_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."google_drive_folders" ADD CONSTRAINT "google_drive_folders_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."service_templates" ADD CONSTRAINT "service_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_availability" ADD CONSTRAINT "operator_availability_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."operator_availability" ADD CONSTRAINT "operator_availability_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "commandcentered"."operators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."magic_links" ADD CONSTRAINT "magic_links_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."system_settings" ADD CONSTRAINT "system_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."integration_logs" ADD CONSTRAINT "integration_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."shift_templates" ADD CONSTRAINT "shift_templates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."lead_products" ADD CONSTRAINT "lead_products_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."lead_products" ADD CONSTRAINT "lead_products_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."dashboard_widget_preferences" ADD CONSTRAINT "dashboard_widget_preferences_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."dashboard_widget_preferences" ADD CONSTRAINT "dashboard_widget_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "commandcentered"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."communication_touchpoints" ADD CONSTRAINT "communication_touchpoints_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."communication_touchpoints" ADD CONSTRAINT "communication_touchpoints_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "commandcentered"."leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."communication_touchpoints" ADD CONSTRAINT "communication_touchpoints_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "commandcentered"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."communication_touchpoints" ADD CONSTRAINT "communication_touchpoints_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "commandcentered"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_dependencies" ADD CONSTRAINT "gear_dependencies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_dependencies" ADD CONSTRAINT "gear_dependencies_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "commandcentered"."gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."gear_dependencies" ADD CONSTRAINT "gear_dependencies_dependent_gear_id_fkey" FOREIGN KEY ("dependent_gear_id") REFERENCES "commandcentered"."gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."event_type_gear_recommendations" ADD CONSTRAINT "event_type_gear_recommendations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."event_type_gear_recommendations" ADD CONSTRAINT "event_type_gear_recommendations_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "commandcentered"."gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandcentered"."automated_email_configs" ADD CONSTRAINT "automated_email_configs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "commandcentered"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

