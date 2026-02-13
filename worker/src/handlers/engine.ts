/**
 * Handlers for generic form/compute/rules engine
 */

import { z } from 'zod';
import { Env } from '../types/env';
import {
  ComputeDefinition,
  EvaluationContext,
  Expression,
  FormFieldDefinition,
  computeDefinitions,
  evaluateExpression,
  validateAnswers,
} from '../utils/engine';

type Status = 'draft' | 'published' | 'archived';
type RuleType = 'eligibility' | 'group_assignment' | 'scheduling';

const statusSchema = z.enum(['draft', 'published', 'archived']);
const ruleTypeSchema = z.enum(['eligibility', 'group_assignment', 'scheduling']);

const formTemplateSchema = z.object({
  name: z.string().min(1),
  version: z.number().int().positive().optional(),
  status: statusSchema.optional(),
});

const formFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean().optional(),
  options: z.unknown().optional(),
  validation: z.unknown().optional(),
  order_index: z.number().int().optional(),
});

const formLogicSchema = z.object({
  logic: z.unknown(),
  order_index: z.number().int().optional(),
});

const computeDefinitionSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  definition: z.unknown(),
  version: z.number().int().positive().optional(),
  status: statusSchema.optional(),
});

const ruleSetSchema = z.object({
  rule_type: ruleTypeSchema,
  name: z.string().min(1),
  version: z.number().int().positive().optional(),
  status: statusSchema.optional(),
  expression: z.unknown(),
});

const intakeSubmitSchema = z.object({
  form_template_id: z.number().int(),
  answers: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function jsonResponse(payload: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function parseBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  const rawBody = await request.json();
  return schema.parse(rawBody);
}

function parseJsonValue<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function logAudit(
  env: Env,
  payload: {
    studyId?: string;
    participantId?: string;
    action: string;
    entityType: string;
    entityId?: string | number | null;
    detail: Record<string, unknown>;
  }
): Promise<void> {
  const createdAt = new Date().toISOString();
  await env.DB?.prepare(
    'INSERT INTO audit_logs (study_id, participant_id, action, entity_type, entity_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      payload.studyId ?? null,
      payload.participantId ?? null,
      payload.action,
      payload.entityType,
      payload.entityId?.toString() ?? null,
      JSON.stringify(payload.detail),
      createdAt
    )
    .run();
}

export async function handleCreateFormTemplate(
  request: Request,
  env: Env,
  studyId: string
): Promise<Response> {
  try {
    const body = await parseBody(request, formTemplateSchema);
    const createdAt = new Date().toISOString();
    const version = body.version ?? 1;
    const status: Status = body.status ?? 'draft';

    const result = await env.DB?.prepare(
      'INSERT INTO form_templates (study_id, name, version, status, created_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(studyId, body.name, version, status, createdAt)
      .run();

    const id = result?.meta.last_row_id ?? null;

    await logAudit(env, {
      studyId,
      action: 'form_template_created',
      entityType: 'form_template',
      entityId: id,
      detail: { name: body.name, version, status },
    });

    return jsonResponse({
      form_template: { id, study_id: studyId, name: body.name, version, status, created_at: createdAt },
    }, 201);
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

export async function handleCreateFormField(
  request: Request,
  env: Env,
  studyId: string,
  formId: number
): Promise<Response> {
  try {
    const body = await parseBody(request, formFieldSchema);
    const required = body.required ? 1 : 0;
    const optionsJson = body.options !== undefined ? JSON.stringify(body.options) : null;
    const validationJson = body.validation !== undefined ? JSON.stringify(body.validation) : null;
    const orderIndex = body.order_index ?? 0;

    const result = await env.DB?.prepare(
      'INSERT INTO form_fields (form_template_id, key, label, type, required, options_json, validation_json, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(formId, body.key, body.label, body.type, required, optionsJson, validationJson, orderIndex)
      .run();

    const id = result?.meta.last_row_id ?? null;

    await logAudit(env, {
      studyId,
      action: 'form_field_created',
      entityType: 'form_field',
      entityId: id,
      detail: { form_template_id: formId, key: body.key, type: body.type },
    });

    return jsonResponse(
      {
        form_field: {
          id,
          form_template_id: formId,
          key: body.key,
          label: body.label,
          type: body.type,
          required: Boolean(required),
          options_json: optionsJson,
          validation_json: validationJson,
          order_index: orderIndex,
        },
      },
      201
    );
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

export async function handleCreateFormLogic(
  request: Request,
  env: Env,
  studyId: string,
  formId: number
): Promise<Response> {
  try {
    const body = await parseBody(request, formLogicSchema);
    const orderIndex = body.order_index ?? 0;
    const logicJson = JSON.stringify(body.logic);

    const result = await env.DB?.prepare(
      'INSERT INTO form_logic (form_template_id, logic_json, order_index) VALUES (?, ?, ?)'
    )
      .bind(formId, logicJson, orderIndex)
      .run();

    const id = result?.meta.last_row_id ?? null;

    await logAudit(env, {
      studyId,
      action: 'form_logic_created',
      entityType: 'form_logic',
      entityId: id,
      detail: { form_template_id: formId, order_index: orderIndex },
    });

    return jsonResponse(
      { form_logic: { id, form_template_id: formId, logic_json: logicJson, order_index: orderIndex } },
      201
    );
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

export async function handleCreateComputeDefinition(
  request: Request,
  env: Env,
  studyId: string
): Promise<Response> {
  try {
    const body = await parseBody(request, computeDefinitionSchema);
    const version = body.version ?? 1;
    const status: Status = body.status ?? 'draft';
    const definitionJson = JSON.stringify(body.definition);

    const result = await env.DB?.prepare(
      'INSERT INTO compute_definitions (study_id, key, type, definition_json, version, status) VALUES (?, ?, ?, ?, ?, ?)'
    )
      .bind(studyId, body.key, body.type, definitionJson, version, status)
      .run();

    const id = result?.meta.last_row_id ?? null;

    await logAudit(env, {
      studyId,
      action: 'compute_definition_created',
      entityType: 'compute_definition',
      entityId: id,
      detail: { key: body.key, type: body.type, version, status },
    });

    return jsonResponse(
      {
        compute_definition: {
          id,
          study_id: studyId,
          key: body.key,
          type: body.type,
          definition_json: definitionJson,
          version,
          status,
        },
      },
      201
    );
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

export async function handleCreateRuleSet(
  request: Request,
  env: Env,
  studyId: string
): Promise<Response> {
  try {
    const body = await parseBody(request, ruleSetSchema);
    const version = body.version ?? 1;
    const status: Status = body.status ?? 'draft';
    const expressionJson = JSON.stringify(body.expression);
    const createdAt = new Date().toISOString();

    const result = await env.DB?.prepare(
      'INSERT INTO rule_sets (study_id, rule_type, name, version, status, expression_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(studyId, body.rule_type, body.name, version, status, expressionJson, createdAt)
      .run();

    const id = result?.meta.last_row_id ?? null;

    await logAudit(env, {
      studyId,
      action: 'rule_set_created',
      entityType: 'rule_set',
      entityId: id,
      detail: { name: body.name, rule_type: body.rule_type, version, status },
    });

    return jsonResponse(
      {
        rule_set: {
          id,
          study_id: studyId,
          rule_type: body.rule_type,
          name: body.name,
          version,
          status,
          expression_json: expressionJson,
          created_at: createdAt,
        },
      },
      201
    );
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

function resolveRuleExpression(
  ruleType: RuleType,
  payload: Record<string, unknown>
): { expression?: Expression; assignment?: { key: string; value: string }; plan?: unknown } {
  if (ruleType === 'eligibility') {
    const expression = (payload.expression ?? payload.criteria ?? payload) as Expression;
    return { expression };
  }
  if (ruleType === 'group_assignment') {
    const expression = (payload.when ?? payload.expression ?? payload.criteria ?? payload) as Expression;
    const assignmentPayload = payload.assignment ?? {
      key: payload.group_key,
      value: payload.group_value,
    };
    if (
      assignmentPayload &&
      typeof assignmentPayload === 'object' &&
      'key' in assignmentPayload &&
      'value' in assignmentPayload
    ) {
      return {
        expression,
        assignment: {
          key: String((assignmentPayload as { key: unknown }).key),
          value: String((assignmentPayload as { value: unknown }).value),
        },
      };
    }
    return { expression };
  }
  const expression = (payload.when ?? payload.expression ?? payload.criteria ?? payload) as Expression;
  const plan = payload.plan ?? payload.schedule ?? payload;
  return { expression, plan };
}

export async function handleIntakeSubmit(
  request: Request,
  env: Env,
  studyId: string,
  participantId: string
): Promise<Response> {
  try {
    const body = await parseBody(request, intakeSubmitSchema);
    const submissionTime = new Date().toISOString();

    const template = await env.DB?.prepare(
      'SELECT * FROM form_templates WHERE id = ? AND study_id = ?'
    )
      .bind(body.form_template_id, studyId)
      .first();

    if (!template) {
      return jsonResponse({ error: 'Form template not found' }, 404);
    }

    const fields = (await env.DB?.prepare(
      'SELECT key, type, required, options_json, validation_json FROM form_fields WHERE form_template_id = ? ORDER BY order_index ASC'
    )
      .bind(body.form_template_id)
      .all())?.results as FormFieldDefinition[] | undefined;

    const validation = validateAnswers(fields ?? [], body.answers);
    if (!validation.valid) {
      return jsonResponse({ error: 'Validation failed', errors: validation.errors }, 400);
    }

    const submissionResult = await env.DB?.prepare(
      'INSERT INTO form_submissions (study_id, participant_id, form_template_id, answers_json, submitted_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(studyId, participantId, body.form_template_id, JSON.stringify(body.answers), submissionTime)
      .run();

    const submissionId = submissionResult?.meta.last_row_id ?? null;

    const computeRows = (await env.DB?.prepare(
      'SELECT key, type, definition_json FROM compute_definitions WHERE study_id = ? AND status = ?'
    )
      .bind(studyId, 'published')
      .all())?.results as Array<{ key: string; type: string; definition_json: string }> | undefined;

    const computeDefinitionsList: ComputeDefinition[] =
      computeRows?.map((row) => ({
        key: row.key,
        type: row.type,
        definition: parseJsonValue(row.definition_json, null),
      })) ?? [];

    const metadata = {
      study_id: studyId,
      participant_id: participantId,
      form_template_id: body.form_template_id,
      submission_id: submissionId,
      submitted_at: submissionTime,
      ...(body.metadata ?? {}),
    };

    const evaluationContext: EvaluationContext = {
      answers: body.answers,
      computed: {},
      metadata,
    };

    const computedValues = computeDefinitions(computeDefinitionsList, evaluationContext);

    if (submissionId !== null) {
      for (const definition of computeDefinitionsList) {
        const value = computedValues[definition.key];
        await env.DB?.prepare(
          'INSERT INTO computed_values (submission_id, key, value_json, computed_at) VALUES (?, ?, ?, ?)'
        )
          .bind(submissionId, definition.key, JSON.stringify(value), submissionTime)
          .run();
      }
    }

    const rules = (await env.DB?.prepare(
      'SELECT id, rule_type, name, expression_json FROM rule_sets WHERE study_id = ? AND status = ?'
    )
      .bind(studyId, 'published')
      .all())?.results as Array<{ id: number; rule_type: RuleType; name: string; expression_json: string }> | undefined;

    const evaluations: Array<Record<string, unknown>> = [];
    const assignments: Array<{ rule_set_id: number; group_key: string; group_value: string }> = [];
    const schedulePlans: Array<{ rule_set_id: number; plan: unknown }> = [];

    const ruleContext: EvaluationContext = {
      answers: body.answers,
      computed: computedValues,
      metadata,
    };

    for (const rule of rules ?? []) {
      const parsedExpression = parseJsonValue<Record<string, unknown>>(rule.expression_json, {});
      const resolved = resolveRuleExpression(rule.rule_type, parsedExpression);
      const matched = resolved.expression ? evaluateExpression(resolved.expression, ruleContext) : false;

      const evaluationDetail: Record<string, unknown> = {
        rule_set_id: rule.id,
        rule_type: rule.rule_type,
        name: rule.name,
        matched,
      };

      if (matched && rule.rule_type === 'group_assignment' && resolved.assignment) {
        assignments.push({
          rule_set_id: rule.id,
          group_key: resolved.assignment.key,
          group_value: resolved.assignment.value,
        });
        evaluationDetail.assignment = resolved.assignment;
      }

      if (matched && rule.rule_type === 'scheduling' && resolved.plan !== undefined) {
        schedulePlans.push({ rule_set_id: rule.id, plan: resolved.plan });
        evaluationDetail.plan = resolved.plan;
      }

      evaluations.push(evaluationDetail);

      if (submissionId !== null) {
        await env.DB?.prepare(
          'INSERT INTO rule_evaluations (submission_id, rule_set_id, result_bool, result_json, evaluated_at) VALUES (?, ?, ?, ?, ?)'
        )
          .bind(submissionId, rule.id, matched ? 1 : 0, JSON.stringify(evaluationDetail), submissionTime)
          .run();
      }
    }

    for (const assignment of assignments) {
      await env.DB?.prepare(
        'INSERT INTO participant_assignments (participant_id, study_id, group_key, group_value, assigned_at) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(participantId, studyId, assignment.group_key, assignment.group_value, submissionTime)
        .run();
    }

    let schedulePlanPayload: { plans: Array<{ rule_set_id: number; plan: unknown }> } | null = null;
    if (schedulePlans.length > 0) {
      schedulePlanPayload = { plans: schedulePlans };
      await env.DB?.prepare(
        'INSERT INTO schedule_plans (participant_id, study_id, plan_json, created_at) VALUES (?, ?, ?, ?)'
      )
        .bind(participantId, studyId, JSON.stringify(schedulePlanPayload), submissionTime)
        .run();
    }

    await logAudit(env, {
      studyId,
      participantId,
      action: 'intake_submitted',
      entityType: 'form_submission',
      entityId: submissionId ?? undefined,
      detail: {
        form_template_id: body.form_template_id,
        computed_keys: computeDefinitionsList.map((definition) => definition.key),
        rule_count: evaluations.length,
      },
    });

    return jsonResponse(
      {
        submission: {
          id: submissionId,
          study_id: studyId,
          participant_id: participantId,
          form_template_id: body.form_template_id,
          submitted_at: submissionTime,
        },
        answers: body.answers,
        computed: computedValues,
        rule_evaluations: evaluations,
        assignments,
        schedule_plan: schedulePlanPayload,
      },
      201
    );
  } catch (error) {
    return jsonResponse({ error: (error as Error).message }, 400);
  }
}

export async function handleIntakeResult(
  env: Env,
  studyId: string,
  participantId: string
): Promise<Response> {
  const submission = await env.DB?.prepare(
    'SELECT * FROM form_submissions WHERE study_id = ? AND participant_id = ? ORDER BY submitted_at DESC LIMIT 1'
  )
    .bind(studyId, participantId)
    .first();

  if (!submission) {
    return jsonResponse({ error: 'No intake submission found' }, 404);
  }

  const computedRows = (await env.DB?.prepare(
    'SELECT key, value_json FROM computed_values WHERE submission_id = ? ORDER BY id ASC'
  )
    .bind(submission.id)
    .all())?.results as Array<{ key: string; value_json: string }> | undefined;

  const computedValues = (computedRows ?? []).reduce<Record<string, unknown>>((acc, row) => {
    acc[row.key] = parseJsonValue(row.value_json, null);
    return acc;
  }, {});

  const ruleRows = (await env.DB?.prepare(
    'SELECT rule_set_id, result_json, result_bool FROM rule_evaluations WHERE submission_id = ? ORDER BY id ASC'
  )
    .bind(submission.id)
    .all())?.results as Array<{ rule_set_id: number; result_json: string; result_bool: number }> | undefined;

  const assignments = (await env.DB?.prepare(
    'SELECT group_key, group_value, assigned_at FROM participant_assignments WHERE participant_id = ? AND study_id = ? ORDER BY assigned_at DESC'
  )
    .bind(participantId, studyId)
    .all())?.results as Array<{ group_key: string; group_value: string; assigned_at: string }> | undefined;

  const schedulePlan = await env.DB?.prepare(
    'SELECT plan_json, created_at FROM schedule_plans WHERE participant_id = ? AND study_id = ? ORDER BY created_at DESC LIMIT 1'
  )
    .bind(participantId, studyId)
    .first();

  const responsePayload = {
    submission: {
      id: submission.id,
      study_id: submission.study_id,
      participant_id: submission.participant_id,
      form_template_id: submission.form_template_id,
      submitted_at: submission.submitted_at,
    },
    answers: parseJsonValue(submission.answers_json, {}),
    computed: computedValues,
    rule_evaluations: (ruleRows ?? []).map((row) => parseJsonValue(row.result_json, { rule_set_id: row.rule_set_id })),
    assignments: assignments ?? [],
    schedule_plan: schedulePlan ? parseJsonValue(schedulePlan.plan_json, null) : null,
  };

  await logAudit(env, {
    studyId,
    participantId,
    action: 'intake_result_viewed',
    entityType: 'form_submission',
    entityId: submission.id,
    detail: { submission_id: submission.id },
  });

  return jsonResponse(responsePayload);
}
