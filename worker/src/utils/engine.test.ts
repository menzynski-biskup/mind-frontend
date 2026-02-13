import { describe, expect, it } from 'vitest';
import { computeDefinitions, evaluateExpression } from './engine';

describe('evaluateExpression', () => {
  it('evaluates logical groups and operators', () => {
    const context = {
      answers: { age: 25, cohort: 'A' },
      computed: { score: 12 },
      metadata: { site: 'main' },
    };

    const expression = {
      all: [
        { op: '>=', left: { var: 'answers.age' }, right: { value: 18 } },
        { op: 'in', left: { var: 'answers.cohort' }, right: { value: ['A', 'B'] } },
        {
          any: [
            { op: '==', left: { var: 'metadata.site' }, right: { value: 'main' } },
            { op: '>', left: { var: 'computed.score' }, right: { value: 15 } },
          ],
        },
      ],
    } as const;

    expect(evaluateExpression(expression, context)).toBe(true);
  });

  it('supports between and not operators', () => {
    const context = {
      answers: { score: 7 },
      computed: {},
      metadata: {},
    };

    const expression = {
      not: {
        op: 'between',
        left: { var: 'answers.score' },
        min: { value: 8 },
        max: { value: 10 },
      },
    } as const;

    expect(evaluateExpression(expression, context)).toBe(true);
  });
});

describe('computeDefinitions', () => {
  it('evaluates compute functions and dependencies', () => {
    const definitions = [
      {
        key: 'sleep_duration',
        type: 'number',
        definition: {
          func: 'duration',
          args: [{ var: 'answers.sleep_start' }, { var: 'answers.sleep_end' }],
        },
      },
      {
        key: 'sleep_midpoint',
        type: 'time',
        definition: {
          func: 'midpoint',
          args: [{ var: 'answers.sleep_start' }, { var: 'answers.sleep_end' }],
        },
      },
      {
        key: 'sleep_midpoint_normalized',
        type: 'time',
        definition: {
          func: 'normalize_time',
          args: [{ var: 'computed.sleep_midpoint' }],
        },
      },
      {
        key: 'follow_up_date',
        type: 'date',
        definition: {
          func: 'add_days',
          args: [{ var: 'answers.baseline_date' }, { value: 7 }],
        },
      },
      {
        key: 'double_duration',
        type: 'number',
        definition: {
          op: 'multiply',
          args: [{ var: 'computed.sleep_duration' }, { value: 2 }],
        },
      },
    ];

    const result = computeDefinitions(definitions, {
      answers: {
        sleep_start: '22:00',
        sleep_end: '06:00',
        baseline_date: '2026-02-13',
      },
      computed: {},
      metadata: {},
    });

    expect(result.sleep_duration).toBe(480);
    expect(result.double_duration).toBe(960);
    expect(result.sleep_midpoint).toBe('02:00');
    expect(result.sleep_midpoint_normalized).toBe('02:00');
    expect(result.follow_up_date).toBe('2026-02-20');
  });
});
