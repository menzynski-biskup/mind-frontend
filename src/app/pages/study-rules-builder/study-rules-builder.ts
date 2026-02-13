import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult, StudyEngineService } from '../../services/study-engine.service';

@Component({
  selector: 'app-study-rules-builder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './study-rules-builder.html',
  styleUrl: './study-rules-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyRulesBuilderComponent {
  private readonly engineService = inject(StudyEngineService);

  protected readonly ruleForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    ruleType: new FormControl('eligibility', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('Eligibility check', { nonNullable: true, validators: [Validators.required] }),
    version: new FormControl(1, { nonNullable: true }),
    status: new FormControl('draft', { nonNullable: true }),
    expressionJson: new FormControl(
      '{ "op": ">=", "left": { "var": "answers.age" }, "right": { "value": 18 } }',
      { nonNullable: true, validators: [Validators.required] }
    ),
  });

  protected readonly ruleResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly ruleMessage = signal<string | null>(null);
  protected readonly statuses = ['draft', 'published', 'archived'];
  protected readonly ruleTypes = ['eligibility', 'group_assignment', 'scheduling'];

  async createRuleSet(): Promise<void> {
    this.ruleMessage.set(null);
    if (this.ruleForm.invalid) {
      this.ruleMessage.set('Fill out required rule set details.');
      return;
    }
    const { studyId, ruleType, name, version, status, expressionJson } = this.ruleForm.getRawValue();
    const expressionParse = this.parseJsonInput(expressionJson);
    if (!expressionParse.ok) {
      this.ruleMessage.set(expressionParse.error ?? 'Invalid JSON input.');
      return;
    }
    const result = await this.engineService.createRuleSet(studyId, {
      rule_type: ruleType,
      name,
      version: Number(version),
      status,
      expression: expressionParse.value,
    });
    this.ruleResult.set(result);
    if (!result.ok) {
      this.ruleMessage.set(result.error ?? 'Unable to create rule set.');
    }
  }

  private parseJsonInput(value: string): { ok: boolean; value?: unknown; error?: string } {
    if (!value || value.trim().length === 0) {
      return { ok: false, error: 'Expression JSON is required.' };
    }
    try {
      return { ok: true, value: JSON.parse(value) };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
