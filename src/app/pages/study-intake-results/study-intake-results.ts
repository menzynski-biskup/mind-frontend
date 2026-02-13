import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult, StudyEngineService } from '../../services/study-engine.service';

@Component({
  selector: 'app-study-intake-results',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './study-intake-results.html',
  styleUrl: './study-intake-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyIntakeResultsComponent {
  private readonly engineService = inject(StudyEngineService);

  protected readonly submitForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    participantId: new FormControl('participant-001', { nonNullable: true, validators: [Validators.required] }),
    formTemplateId: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    answersJson: new FormControl(
      '{ "age": 28, "sleep_start": "22:30", "sleep_end": "06:30" }',
      { nonNullable: true, validators: [Validators.required] }
    ),
    metadataJson: new FormControl('', { nonNullable: true }),
  });

  protected readonly resultForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    participantId: new FormControl('participant-001', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly submitResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly submitMessage = signal<string | null>(null);
  protected readonly intakeResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly intakeMessage = signal<string | null>(null);

  async submitIntake(): Promise<void> {
    this.submitMessage.set(null);
    if (this.submitForm.invalid) {
      this.submitMessage.set('Fill out required intake submission fields.');
      return;
    }
    const { studyId, participantId, formTemplateId, answersJson, metadataJson } =
      this.submitForm.getRawValue();
    const answersParse = this.parseJsonInput(answersJson);
    const metadataParse = this.parseOptionalJsonInput(metadataJson);
    if (!answersParse.ok) {
      this.submitMessage.set(answersParse.error ?? 'Invalid answers JSON.');
      return;
    }
    if (!metadataParse.ok) {
      this.submitMessage.set(metadataParse.error ?? 'Invalid metadata JSON.');
      return;
    }
    const result = await this.engineService.submitIntake(studyId, participantId, {
      form_template_id: Number(formTemplateId),
      answers: answersParse.value,
      metadata: metadataParse.value,
    });
    this.submitResult.set(result);
    if (result.ok) {
      this.resultForm.controls.studyId.setValue(studyId);
      this.resultForm.controls.participantId.setValue(participantId);
    } else {
      this.submitMessage.set(result.error ?? 'Unable to submit intake.');
    }
  }

  async loadResult(): Promise<void> {
    this.intakeMessage.set(null);
    if (this.resultForm.invalid) {
      this.intakeMessage.set('Provide study and participant IDs.');
      return;
    }
    const { studyId, participantId } = this.resultForm.getRawValue();
    const result = await this.engineService.fetchIntakeResult(studyId, participantId);
    this.intakeResult.set(result);
    if (!result.ok) {
      this.intakeMessage.set(result.error ?? 'Unable to load intake result.');
    }
  }

  private parseJsonInput(value: string): { ok: boolean; value?: unknown; error?: string } {
    if (!value || value.trim().length === 0) {
      return { ok: false, error: 'JSON is required.' };
    }
    try {
      return { ok: true, value: JSON.parse(value) };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  private parseOptionalJsonInput(value: string): { ok: boolean; value?: unknown; error?: string } {
    if (!value || value.trim().length === 0) {
      return { ok: true, value: undefined };
    }
    try {
      return { ok: true, value: JSON.parse(value) };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
