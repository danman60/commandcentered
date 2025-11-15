-- Row-Level Security Policies for CommandCentered
-- Run this SQL after migrating the schema
-- This ensures multi-tenant isolation at the database level

-- Helper function to get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
  SELECT tenant_id FROM user_profiles
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION user_is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE auth_user_id = auth.uid()
    AND role IN ('SUPER_ADMIN', 'COMPETITION_DIRECTOR')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_blackout_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_skill_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_gear_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_movement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_revision_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_drive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widget_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_type_gear_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_email_configs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TENANTS TABLE POLICIES
-- ============================================

-- Users can only see their own tenant
CREATE POLICY "tenant_read" ON tenants
FOR SELECT USING (id = get_user_tenant_id());

-- Only admins can update tenant settings
CREATE POLICY "tenant_update" ON tenants
FOR UPDATE USING (id = get_user_tenant_id() AND user_is_admin());

-- ============================================
-- USER_PROFILES TABLE POLICIES
-- ============================================

-- Users can see all profiles in their tenant
CREATE POLICY "user_profiles_read" ON user_profiles
FOR SELECT USING (tenant_id = get_user_tenant_id());

-- Users can update their own profile
CREATE POLICY "user_profiles_update_own" ON user_profiles
FOR UPDATE USING (auth_user_id = auth.uid());

-- Admins can update any profile in their tenant
CREATE POLICY "user_profiles_update_admin" ON user_profiles
FOR UPDATE USING (tenant_id = get_user_tenant_id() AND user_is_admin());

-- Admins can invite new users (insert)
CREATE POLICY "user_profiles_insert" ON user_profiles
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() AND user_is_admin());

-- ============================================
-- GENERIC TENANT-SCOPED POLICIES
-- Apply to most tables with tenant_id
-- ============================================

-- Events
CREATE POLICY "events_read" ON events
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "events_write" ON events
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "events_update" ON events
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "events_delete" ON events
FOR DELETE USING (tenant_id = get_user_tenant_id() AND user_is_admin());

-- Shifts
CREATE POLICY "shifts_read" ON shifts
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "shifts_write" ON shifts
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "shifts_update" ON shifts
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "shifts_delete" ON shifts
FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Shift Assignments
CREATE POLICY "shift_assignments_read" ON shift_assignments
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "shift_assignments_write" ON shift_assignments
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "shift_assignments_update" ON shift_assignments
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "shift_assignments_delete" ON shift_assignments
FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Operators
CREATE POLICY "operators_read" ON operators
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "operators_write" ON operators
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "operators_update" ON operators
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "operators_delete" ON operators
FOR DELETE USING (tenant_id = get_user_tenant_id() AND user_is_admin());

-- Gear
CREATE POLICY "gear_read" ON gear
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_write" ON gear
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_update" ON gear
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_delete" ON gear
FOR DELETE USING (tenant_id = get_user_tenant_id() AND user_is_admin());

-- Gear Kits
CREATE POLICY "gear_kits_read" ON gear_kits
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_kits_write" ON gear_kits
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_kits_update" ON gear_kits
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "gear_kits_delete" ON gear_kits
FOR DELETE USING (tenant_id = get_user_tenant_id());

-- Leads
CREATE POLICY "leads_read" ON leads
FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "leads_write" ON leads
FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "leads_update" ON leads
FOR UPDATE USING (tenant_id = get_user_tenant_id());

CREATE POLICY "leads_delete" ON leads
FOR DELETE USING (tenant_id = get_user_tenant_id() AND user_is_admin());

-- NOTE: For remaining tables, apply the same pattern:
-- - SELECT: tenant_id = get_user_tenant_id()
-- - INSERT: tenant_id = get_user_tenant_id()
-- - UPDATE: tenant_id = get_user_tenant_id()
-- - DELETE: tenant_id = get_user_tenant_id() AND user_is_admin()

-- ============================================
-- DATABASE TRIGGER FOR USER CREATION
-- ============================================

-- Create UserProfile automatically when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Create tenant if this is a signup (has company_name in metadata)
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    INSERT INTO tenants (name, subdomain)
    VALUES (
      NEW.raw_user_meta_data->>'company_name',
      NEW.raw_user_meta_data->>'subdomain'
    )
    RETURNING id INTO new_tenant_id;

    -- Create user profile as admin
    INSERT INTO user_profiles (auth_user_id, tenant_id, email, role, name)
    VALUES (
      NEW.id,
      new_tenant_id,
      NEW.email,
      'SUPER_ADMIN',
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
