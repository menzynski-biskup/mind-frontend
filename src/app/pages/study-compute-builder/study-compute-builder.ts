import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult, StudyEngineService } from '../../services/study-engine.service';

@Component({
  selector: 'app-study-compute-builder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './study-compute-builder.html',
  styleUrl: './study-compute-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyComputeBuilderComponent {
  private readonly engineService = inject(StudyEngineService);

  protected readonly computeForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    key: new FormControl('sleep_duration', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('number', { nonNullable: true, validators: [Validators.required] }),
    version: new FormControl(1, { nonNullable: true }),
    status: new FormControl('draft', { nonNullable: true }),
    definitionJson: new FormControl(
      '{ "func": "duration", "args": [{ "var": "answers.sleep_start" }, { "var": "answers.sleep_end" }] }',
      { nonNullable: true, validators: [Validators.required] }
    ),
  });

  protected readonly computeResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly computeMessage = signal<string | null>(null);
  protected readonly statuses = ['draft', 'published', 'archived'];

  async createComputeDefinition(): Promise<void> {
    this.computeMessage.set(null);
    if (this.computeForm.invalid) {
      this.computeMessage.set('Fill out required compute definition fields.');
      return;
    }
    const { studyId, key, type, version, status, definitionJson } = this.computeForm.getRawValue();
    const definitionParse = this.parseJsonInput(definitionJson);
    if (!definitionParse.ok) {
      this.computeMessage.set(definitionParse.error ?? 'Invalid JSON input.');
      return;
    }
    const result = await this.engineService.createComputeDefinition(studyId, {
      key,
      type,
      version: Number(version),
      status,
      definition: definitionParse.value,
    });
    this.computeResult.set(result);
    if (!result.ok) {
      this.computeMessage.set(result.error ?? 'Unable to create compute definition.');
    }
  }

  private parseJsonInput(value: string): { ok: boolean; value?: unknown; error?: string } {
    if (!value || value.trim().length === 0) {
      return { ok: false, error: 'Definition JSON is required.' };
    }
    try {
      return { ok: true, value: JSON.parse(value) };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
