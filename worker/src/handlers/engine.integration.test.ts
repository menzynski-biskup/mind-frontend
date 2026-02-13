import { describe, expect, it } from 'vitest';
import { handleIntakeResult, handleIntakeSubmit } from './engine';
import { Env } from '../types/env';

type Row = Record<string, unknown>;

class FakeStatement {
  private params: unknown[] = [];

  constructor(private readonly db: FakeD1, private readonly sql: string) {}

  bind(...params: unknown[]): FakeStatement {
    this.params = params;
    return this;
  }

  async run(): Promise<{ success: boolean; meta: { last_row_id: number | null } }> {
    return this.db.run(this.sql, this.params);
  }

  async all(): Promise<{ results: Row[] }> {
    return { results: this.db.all(this.sql, this.params) };
  }

  async first(): Promise<Row | null> {
    return this.db.first(this.sql, this.params);
  }
}

class FakeD1 {
  private counters: Record<string, number> = {
    form_templates: 1,
    form_fields: 1,
    form_logic: 1,
    compute_definitions: 1,
    rule_sets: 1,
    form_submissions: 1,
    computed_values: 1,
    rule_evaluations: 1,
    participant_assignments: 1,
    schedule_plans: 1,
    audit_logs: 1,
  };

  private tables: Record<string, Row[]> = {
    form_templates: [],
    form_fields: [],
    form_logic: [],
    compute_definitions: [],
    rule_sets: [],
    form_submissions: [],
    computed_values: [],
    rule_evaluations: [],
    participant_assignments: [],
    schedule_plans: [],
    audit_logs: [],
  };

  prepare(sql: string): FakeStatement {
    return new FakeStatement(this, sql);
  }

  seed(table: keyof FakeD1['tables'], row: Row): number {
    const id = this.counters[table]++;
    this.tables[table].push({ id, ...row });
    return id;
  }

  run(sql: string, params: unknown[]): { success: boolean; meta: { last_row_id: number | null } } {
    if (sql.startsWith('INSERT INTO form_templates')) {
      const [study_id, name, version, status, created_at] = params;
      return {
        success: true,
        meta: { last_row_id: this.seed('form_templates', { study_id, name, version, status, created_at }) },
      };
    }
    if (sql.startsWith('INSERT INTO form_fields')) {
      const [form_template_id, key, label, type, required, options_json, validation_json, order_index] =
        params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('form_fields', {
            form_template_id,
            key,
            label,
            type,
            required,
            options_json,
            validation_json,
            order_index,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO compute_definitions')) {
      const [study_id, key, type, definition_json, version, status] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('compute_definitions', {
            study_id,
            key,
            type,
            definition_json,
            version,
            status,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO rule_sets')) {
      const [study_id, rule_type, name, version, status, expression_json, created_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('rule_sets', {
            study_id,
            rule_type,
            name,
            version,
            status,
            expression_json,
            created_at,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO form_submissions')) {
      const [study_id, participant_id, form_template_id, answers_json, submitted_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('form_submissions', {
            study_id,
            participant_id,
            form_template_id,
            answers_json,
            submitted_at,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO computed_values')) {
      const [submission_id, key, value_json, computed_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('computed_values', { submission_id, key, value_json, computed_at }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO rule_evaluations')) {
      const [submission_id, rule_set_id, result_bool, result_json, evaluated_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('rule_evaluations', {
            submission_id,
            rule_set_id,
            result_bool,
            result_json,
            evaluated_at,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO participant_assignments')) {
      const [participant_id, study_id, group_key, group_value, assigned_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('participant_assignments', {
            participant_id,
            study_id,
            group_key,
            group_value,
            assigned_at,
          }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO schedule_plans')) {
      const [participant_id, study_id, plan_json, created_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('schedule_plans', { participant_id, study_id, plan_json, created_at }),
        },
      };
    }
    if (sql.startsWith('INSERT INTO audit_logs')) {
      const [study_id, participant_id, action, entity_type, entity_id, detail_json, created_at] = params;
      return {
        success: true,
        meta: {
          last_row_id: this.seed('audit_logs', {
            study_id,
            participant_id,
            action,
            entity_type,
            entity_id,
            detail_json,
            created_at,
          }),
        },
      };
    }
    return { success: true, meta: { last_row_id: null } };
  }

  all(sql: string, params: unknown[]): Row[] {
    if (sql.startsWith('SELECT key, type, required, options_json, validation_json FROM form_fields')) {
      const [form_template_id] = params;
      return this.tables.form_fields
        .filter((row) => row.form_template_id === form_template_id)
        .sort((a, b) => Number(a.order_index) - Number(b.order_index))
        .map((row) => ({
          key: row.key,
          type: row.type,
          required: row.required,
          options_json: row.options_json,
          validation_json: row.validation_json,
        }));
    }
    if (sql.startsWith('SELECT key, type, definition_json FROM compute_definitions')) {
      const [study_id, status] = params;
      return this.tables.compute_definitions.filter(
        (row) => row.study_id === study_id && row.status === status
      );
    }
    if (sql.startsWith('SELECT id, rule_type, name, expression_json FROM rule_sets')) {
      const [study_id, status] = params;
      return this.tables.rule_sets.filter(
        (row) => row.study_id === study_id && row.status === status
      );
    }
    if (sql.startsWith('SELECT key, value_json FROM computed_values')) {
      const [submission_id] = params;
      return this.tables.computed_values.filter((row) => row.submission_id === submission_id);
    }
    if (sql.startsWith('SELECT rule_set_id, result_json, result_bool FROM rule_evaluations')) {
      const [submission_id] = params;
      return this.tables.rule_evaluations.filter((row) => row.submission_id === submission_id);
    }
    if (sql.startsWith('SELECT group_key, group_value, assigned_at FROM participant_assignments')) {
      const [participant_id, study_id] = params;
      return this.tables.participant_assignments.filter(
        (row) => row.participant_id === participant_id && row.study_id === study_id
      );
    }
    return [];
  }

  first(sql: string, params: unknown[]): Row | null {
    if (sql.startsWith('SELECT * FROM form_templates')) {
      const [id, study_id] = params;
      return this.tables.form_templates.find(
        (row) => row.id === id && row.study_id === study_id
      ) ?? null;
    }
    if (sql.startsWith('SELECT * FROM form_submissions')) {
      const [study_id, participant_id] = params;
      const submissions = this.tables.form_submissions.filter(
        (row) => row.study_id === study_id && row.participant_id === participant_id
      );
      return submissions[submissions.length - 1] ?? null;
    }
    if (sql.startsWith('SELECT plan_json, created_at FROM schedule_plans')) {
      const [participant_id, study_id] = params;
      const plans = this.tables.schedule_plans.filter(
        (row) => row.participant_id === participant_id && row.study_id === study_id
      );
      return plans[plans.length - 1] ?? null;
    }
    return null;
  }
}

describe('intake submit pipeline', () => {
  it('validates answers, computes values, evaluates rules, and persists results', async () => {
    const db = new FakeD1();
    const studyId = 'study-42';
    const participantId = 'participant-007';

    const formTemplateId = db.seed('form_templates', {
      study_id: studyId,
      name: 'Baseline intake',
      version: 1,
      status: 'published',
      created_at: new Date().toISOString(),
    });

    db.seed('form_fields', {
      form_template_id: formTemplateId,
      key: 'age',
      label: 'Age',
      type: 'number',
      required: 1,
      options_json: null,
      validation_json: JSON.stringify({ min: 18 }),
      order_index: 0,
    });

    db.seed('form_fields', {
      form_template_id: formTemplateId,
      key: 'sleep_start',
      label: 'Sleep start',
      type: 'time',
      required: 1,
      options_json: null,
      validation_json: null,
      order_index: 1,
    });

    db.seed('form_fields', {
      form_template_id: formTemplateId,
      key: 'sleep_end',
      label: 'Sleep end',
      type: 'time',
      required: 1,
      options_json: null,
      validation_json: null,
      order_index: 2,
    });

    db.seed('compute_definitions', {
      study_id: studyId,
      key: 'sleep_duration',
      type: 'number',
      definition_json: JSON.stringify({
        func: 'duration',
        args: [{ var: 'answers.sleep_start' }, { var: 'answers.sleep_end' }],
      }),
      version: 1,
      status: 'published',
    });

    db.seed('rule_sets', {
      study_id: studyId,
      rule_type: 'eligibility',
      name: 'Age check',
      version: 1,
      status: 'published',
      expression_json: JSON.stringify({
        op: '>=',
        left: { var: 'answers.age' },
        right: { value: 18 },
      }),
      created_at: new Date().toISOString(),
    });

    db.seed('rule_sets', {
      study_id: studyId,
      rule_type: 'group_assignment',
      name: 'Young adult cohort',
      version: 1,
      status: 'published',
      expression_json: JSON.stringify({
        when: {
          op: 'between',
          left: { var: 'answers.age' },
          min: { value: 18 },
          max: { value: 30 },
        },
        assignment: { key: 'cohort', value: 'young-adult' },
      }),
      created_at: new Date().toISOString(),
    });

    db.seed('rule_sets', {
      study_id: studyId,
      rule_type: 'scheduling',
      name: 'Baseline schedule',
      version: 1,
      status: 'published',
      expression_json: JSON.stringify({
        when: { op: '>=', left: { var: 'answers.age' }, right: { value: 18 } },
        plan: { visit: 'baseline', offset_days: 7 },
      }),
      created_at: new Date().toISOString(),
    });

    const env: Env = { DB: db as unknown as D1Database };

    const request = new Request('http://example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_template_id: formTemplateId,
        answers: {
          age: 24,
          sleep_start: '22:00',
          sleep_end: '06:00',
        },
      }),
    });

    const response = await handleIntakeSubmit(request, env, studyId, participantId);
    const payload = (await response.json()) as Record<string, unknown>;
    expect(response.status, JSON.stringify(payload)).toBe(201);

    expect(payload.computed).toMatchObject({ sleep_duration: 480 });
    expect(Array.isArray(payload.rule_evaluations)).toBe(true);
    expect(payload.assignments).toMatchObject([
      { rule_set_id: 2, group_key: 'cohort', group_value: 'young-adult' },
    ]);
    expect(payload.schedule_plan).toMatchObject({
      plans: [{ rule_set_id: 3, plan: { visit: 'baseline', offset_days: 7 } }],
    });

    const resultResponse = await handleIntakeResult(env, studyId, participantId);
    expect(resultResponse.status).toBe(200);
    const resultPayload = (await resultResponse.json()) as Record<string, unknown>;
    expect(resultPayload.computed).toMatchObject({ sleep_duration: 480 });
  });
});
