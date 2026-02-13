/**
 * Generic expression evaluator and compute engine utilities
 */

import { z } from 'zod';

export type Operator =
  | '=='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not_in'
  | 'between'
  | 'exists';

export type Operand = { var: string } | { value: unknown } | string | number | boolean | null;

export type Expression =
  | { all: Expression[] }
  | { any: Expression[] }
  | { not: Expression }
  | {
      op: Operator;
      left?: Operand;
      right?: Operand;
      value?: Operand;
      min?: Operand;
      max?: Operand;
    };

export interface EvaluationContext {
  answers: Record<string, unknown>;
  computed: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export type ComputeFunction = 'midpoint' | 'duration' | 'add_days' | 'normalize_time';

export type ComputeExpression =
  | { var: string }
  | { value: unknown }
  | { func: ComputeFunction; args: ComputeExpression[] }
  | { op: 'add' | 'subtract' | 'multiply' | 'divide'; args: ComputeExpression[] }
  | string
  | number
  | boolean
  | null;

export interface ComputeDefinition {
  key: string;
  type: string;
  definition: ComputeExpression;
}

export interface FormFieldDefinition {
  key: string;
  type: string;
  required: boolean | number;
  options_json?: string | unknown | null;
  validation_json?: string | unknown | null;
}

export interface ValidationIssue {
  key: string;
  message: string;
}

const TIME_REGEX = /^\d{1,2}:\d{2}(:\d{2})?$/;

function resolvePath(target: Record<string, unknown>, path: string[]): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, target);
}

function resolveVariable(variable: string, context: EvaluationContext): unknown {
  const [scope, ...pathParts] = variable.split('.');
  if (scope === 'answers') {
    return pathParts.length ? resolvePath(context.answers, pathParts) : context.answers;
  }
  if (scope === 'computed') {
    return pathParts.length ? resolvePath(context.computed, pathParts) : context.computed;
  }
  if (scope === 'metadata') {
    return pathParts.length ? resolvePath(context.metadata, pathParts) : context.metadata;
  }
  return undefined;
}

function resolveOperand(operand: Operand | undefined, context: EvaluationContext): unknown {
  if (operand === undefined) {
    return undefined;
  }
  if (typeof operand === 'object' && operand !== null) {
    if ('var' in operand) {
      return resolveVariable(operand.var, context);
    }
    if ('value' in operand) {
      return operand.value;
    }
  }
  return operand;
}

function toComparable(value: unknown): number | string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
    const dateValue = Date.parse(trimmed);
    if (!Number.isNaN(dateValue)) {
      return dateValue;
    }
    return trimmed;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }
  return null;
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
}

export function evaluateExpression(expression: Expression, context: EvaluationContext): boolean {
  if ('all' in expression) {
    return expression.all.every((child) => evaluateExpression(child, context));
  }
  if ('any' in expression) {
    return expression.any.some((child) => evaluateExpression(child, context));
  }
  if ('not' in expression) {
    return !evaluateExpression(expression.not, context);
  }

  const leftValue = resolveOperand(expression.left ?? expression.value, context);
  const rightValue = resolveOperand(expression.right, context);

  switch (expression.op) {
    case 'exists':
      return hasValue(leftValue);
    case '==':
      return leftValue === rightValue;
    case '!=':
      return leftValue !== rightValue;
    case '>':
    case '>=':
    case '<':
    case '<=': {
      const leftComparable = toComparable(leftValue);
      const rightComparable = toComparable(rightValue);
      if (leftComparable === null || rightComparable === null) {
        return false;
      }
      if (expression.op === '>') {
        return leftComparable > rightComparable;
      }
      if (expression.op === '>=') {
        return leftComparable >= rightComparable;
      }
      if (expression.op === '<') {
        return leftComparable < rightComparable;
      }
      return leftComparable <= rightComparable;
    }
    case 'in':
    case 'not_in': {
      const list = Array.isArray(rightValue) ? rightValue : [];
      const found = list.some((item) => item === leftValue);
      return expression.op === 'in' ? found : !found;
    }
    case 'between': {
      const minValue = resolveOperand(expression.min, context);
      const maxValue = resolveOperand(expression.max, context);
      const comparable = toComparable(leftValue);
      const minComparable = toComparable(minValue);
      const maxComparable = toComparable(maxValue);
      if (comparable === null || minComparable === null || maxComparable === null) {
        return false;
      }
      return comparable >= minComparable && comparable <= maxComparable;
    }
    default:
      return false;
  }
}

function parseOptionalJson(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return value;
}

function parseTimeToMinutes(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getHours() * 60 + value.getMinutes();
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!TIME_REGEX.test(trimmed)) {
      return null;
    }
    const [hours, minutes, seconds] = trimmed.split(':').map((part) => Number(part));
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return null;
    }
    const total = hours * 60 + minutes + (Number.isFinite(seconds) ? seconds / 60 : 0);
    return total;
  }
  if (value && typeof value === 'object' && 'minutes' in value) {
    const minutes = (value as { minutes: unknown }).minutes;
    return typeof minutes === 'number' && Number.isFinite(minutes) ? minutes : null;
  }
  return null;
}

function formatMinutes(minutes: number): string {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = Math.round(normalized % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function normalizeTime(value: unknown): string | null {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) {
    return null;
  }
  return formatMinutes(minutes);
}

function midpointTime(start: unknown, end: unknown): string | null {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);
  if (startMinutes === null || endMinutes === null) {
    return null;
  }
  const diff = endMinutes - startMinutes;
  const normalizedDiff = diff < 0 ? diff + 24 * 60 : diff;
  const midpoint = (startMinutes + normalizedDiff / 2) % (24 * 60);
  return formatMinutes(midpoint);
}

function durationMinutes(start: unknown, end: unknown): number | null {
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);
  if (startMinutes === null || endMinutes === null) {
    return null;
  }
  const diff = endMinutes - startMinutes;
  return diff < 0 ? diff + 24 * 60 : diff;
}

function addDaysToDate(dateValue: unknown, daysValue: unknown): string | null {
  if (typeof daysValue !== 'number' || !Number.isFinite(daysValue)) {
    return null;
  }
  if (typeof dateValue !== 'string') {
    return null;
  }
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const result = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
  result.setUTCDate(result.getUTCDate() + Math.trunc(daysValue));
  return result.toISOString().slice(0, 10);
}

function applyArithmetic(op: 'add' | 'subtract' | 'multiply' | 'divide', values: unknown[]): number | null {
  const numericValues = values.map((value) =>
    typeof value === 'number' && Number.isFinite(value) ? value : Number(value)
  );
  if (numericValues.some((value) => !Number.isFinite(value))) {
    return null;
  }
  if (op === 'add') {
    return numericValues.reduce((sum, value) => sum + value, 0);
  }
  if (op === 'subtract') {
    return numericValues.slice(1).reduce((value, current) => value - current, numericValues[0] ?? 0);
  }
  if (op === 'multiply') {
    return numericValues.reduce((product, value) => product * value, 1);
  }
  if (numericValues.length === 0) {
    return null;
  }
  return numericValues.slice(1).reduce((value, current) => value / current, numericValues[0]);
}

function evaluateComputeExpression(
  expression: ComputeExpression,
  context: EvaluationContext,
  resolveComputed: (key: string) => unknown
): unknown {
  if (expression === null || typeof expression !== 'object') {
    return expression;
  }
  if ('var' in expression) {
    const value = resolveVariable(expression.var, context);
    if (expression.var.startsWith('computed.') && value === undefined) {
      const key = expression.var.slice('computed.'.length);
      return resolveComputed(key);
    }
    return value;
  }
  if ('value' in expression) {
    return expression.value;
  }
  if ('func' in expression) {
    const args = expression.args.map((arg) => evaluateComputeExpression(arg, context, resolveComputed));
    switch (expression.func) {
      case 'normalize_time':
        return normalizeTime(args[0]);
      case 'midpoint':
        return midpointTime(args[0], args[1]);
      case 'duration':
        return durationMinutes(args[0], args[1]);
      case 'add_days':
        return addDaysToDate(args[0], args[1]);
    }
  }
  if ('op' in expression) {
    const args = expression.args.map((arg) => evaluateComputeExpression(arg, context, resolveComputed));
    return applyArithmetic(expression.op, args);
  }
  return expression;
}

export function computeDefinitions(
  definitions: ComputeDefinition[],
  context: EvaluationContext
): Record<string, unknown> {
  const definitionMap = new Map<string, ComputeDefinition>();
  definitions.forEach((definition) => {
    definitionMap.set(definition.key, definition);
  });
  const computedValues: Record<string, unknown> = { ...context.computed };
  const visiting = new Set<string>();

  const resolveComputed = (key: string): unknown => {
    if (key in computedValues) {
      return computedValues[key];
    }
    const definition = definitionMap.get(key);
    if (!definition) {
      return undefined;
    }
    if (visiting.has(key)) {
      throw new Error(`Circular compute dependency detected for ${key}`);
    }
    visiting.add(key);
    const value = evaluateComputeExpression(definition.definition, {
      ...context,
      computed: computedValues,
    }, resolveComputed);
    visiting.delete(key);
    computedValues[key] = value;
    return value;
  };

  definitions.forEach((definition) => {
    resolveComputed(definition.key);
  });

  return computedValues;
}

function buildFieldSchema(
  field: FormFieldDefinition,
  options: unknown,
  validation: Record<string, unknown> | undefined
): z.ZodTypeAny {
  const type = field.type.toLowerCase();
  let schema: z.ZodTypeAny;

  if (type === 'number') {
    schema = z.coerce.number({ invalid_type_error: 'Expected a number' });
    if (typeof validation?.min === 'number') {
      schema = schema.min(validation.min as number);
    }
    if (typeof validation?.max === 'number') {
      schema = schema.max(validation.max as number);
    }
  } else if (type === 'boolean') {
    schema = z.boolean({ invalid_type_error: 'Expected a boolean' });
  } else if (type === 'date') {
    schema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    });
  } else if (type === 'time') {
    schema = z.string().regex(TIME_REGEX, 'Invalid time format');
  } else if (type === 'multi_select') {
    schema = z.array(z.string());
  } else {
    schema = z.string();
    if (typeof validation?.minLength === 'number') {
      schema = schema.min(validation.minLength as number);
    }
    if (typeof validation?.maxLength === 'number') {
      schema = schema.max(validation.maxLength as number);
    }
    if (typeof validation?.pattern === 'string') {
      try {
        schema = schema.regex(new RegExp(validation.pattern));
      } catch {
        // Ignore invalid regex patterns
      }
    }
  }

  if (type === 'select' && Array.isArray(options)) {
    schema = schema.refine((value) => options.includes(value), {
      message: 'Value must be one of the defined options',
    });
  }
  if (type === 'multi_select' && Array.isArray(options)) {
    schema = schema.refine(
      (value) => Array.isArray(value) && value.every((entry) => options.includes(entry)),
      { message: 'All selections must be valid options' }
    );
  }

  return schema;
}

export function validateAnswers(
  fields: FormFieldDefinition[],
  answers: Record<string, unknown>
): { valid: boolean; errors: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];

  fields.forEach((field) => {
    const required = Boolean(field.required);
    const rawValue = answers[field.key];
    if (!required && (rawValue === undefined || rawValue === null || rawValue === '')) {
      return;
    }
    if (required && (rawValue === undefined || rawValue === null || rawValue === '')) {
      errors.push({ key: field.key, message: 'Field is required' });
      return;
    }
    const options = parseOptionalJson(field.options_json);
    const validation =
      (parseOptionalJson(field.validation_json) as Record<string, unknown> | undefined) ?? undefined;
    const schema = buildFieldSchema(field, options, validation);
    const result = schema.safeParse(rawValue);
    if (!result.success) {
      errors.push({ key: field.key, message: result.error.errors[0]?.message ?? 'Invalid value' });
    }
  });

  return { valid: errors.length === 0, errors };
}
