-- Migration: Create form, compute, and rules engine tables
-- Description: Supports generic intake forms, derived computations, rule evaluations, and audit logging

CREATE TABLE IF NOT EXISTS form_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_id TEXT NOT NULL,
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS form_fields (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_template_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  options_json TEXT,
  validation_json TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS form_logic (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  form_template_id INTEGER NOT NULL,
  logic_json TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS compute_definitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_id TEXT NOT NULL,
  key TEXT NOT NULL,
  type TEXT NOT NULL,
  definition_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived'))
);

CREATE TABLE IF NOT EXISTS rule_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_id TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK(rule_type IN ('eligibility', 'group_assignment', 'scheduling')),
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
  expression_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  form_template_id INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS computed_values (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rule_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL,
  rule_set_id INTEGER NOT NULL,
  result_bool INTEGER NOT NULL,
  result_json TEXT NOT NULL,
  evaluated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS participant_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  study_id TEXT NOT NULL,
  group_key TEXT NOT NULL,
  group_value TEXT NOT NULL,
  assigned_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS schedule_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL,
  study_id TEXT NOT NULL,
  plan_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  study_id TEXT,
  participant_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_form_templates_study ON form_templates(study_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_template ON form_fields(form_template_id);
CREATE INDEX IF NOT EXISTS idx_form_logic_template ON form_logic(form_template_id);
CREATE INDEX IF NOT EXISTS idx_compute_definitions_study ON compute_definitions(study_id);
CREATE INDEX IF NOT EXISTS idx_rule_sets_study ON rule_sets(study_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_study ON form_submissions(study_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_participant ON form_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_computed_values_submission ON computed_values(submission_id);
CREATE INDEX IF NOT EXISTS idx_rule_evaluations_submission ON rule_evaluations(submission_id);
CREATE INDEX IF NOT EXISTS idx_participant_assignments_study ON participant_assignments(study_id);
CREATE INDEX IF NOT EXISTS idx_schedule_plans_study ON schedule_plans(study_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_study ON audit_logs(study_id);
