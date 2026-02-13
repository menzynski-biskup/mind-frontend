import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResult, StudyEngineService } from '../../services/study-engine.service';

@Component({
  selector: 'app-study-intake-builder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './study-intake-builder.html',
  styleUrl: './study-intake-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyIntakeBuilderComponent {
  private readonly engineService = inject(StudyEngineService);

  protected readonly templateForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('Baseline Intake', { nonNullable: true, validators: [Validators.required] }),
    version: new FormControl(1, { nonNullable: true }),
    status: new FormControl('draft', { nonNullable: true }),
  });

  protected readonly fieldForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    formTemplateId: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    key: new FormControl('age', { nonNullable: true, validators: [Validators.required] }),
    label: new FormControl('Age', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('number', { nonNullable: true, validators: [Validators.required] }),
    required: new FormControl(true, { nonNullable: true }),
    optionsJson: new FormControl('', { nonNullable: true }),
    validationJson: new FormControl('{ "min": 18 }', { nonNullable: true }),
    orderIndex: new FormControl(0, { nonNullable: true }),
  });

  protected readonly logicForm = new FormGroup({
    studyId: new FormControl('study-001', { nonNullable: true, validators: [Validators.required] }),
    formTemplateId: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    logicJson: new FormControl(
      '{ "when": { "op": "==", "left": { "var": "answers.is_student" }, "right": { "value": true } }, "show": ["student_id"] }',
      { nonNullable: true, validators: [Validators.required] }
    ),
    orderIndex: new FormControl(0, { nonNullable: true }),
  });

  protected readonly templateResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly fieldResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly logicResult = signal<ApiResult<Record<string, unknown>> | null>(null);
  protected readonly templateMessage = signal<string | null>(null);
  protected readonly fieldMessage = signal<string | null>(null);
  protected readonly logicMessage = signal<string | null>(null);

  protected readonly statuses = ['draft', 'published', 'archived'];
  protected readonly fieldTypes = ['text', 'number', 'boolean', 'date', 'time', 'select', 'multi_select'];

  async createTemplate(): Promise<void> {
    this.templateMessage.set(null);
    if (this.templateForm.invalid) {
      this.templateMessage.set('Fill out required template fields.');
      return;
    }
    const { studyId, name, version, status } = this.templateForm.getRawValue();
    const result = await this.engineService.createFormTemplate(studyId, {
      name,
      version: Number(version),
      status,
    });
    this.templateResult.set(result);
    if (result.ok) {
      const templateId = (result.data as { form_template?: { id?: number } })?.form_template?.id;
      if (templateId) {
        this.fieldForm.controls.formTemplateId.setValue(templateId);
        this.logicForm.controls.formTemplateId.setValue(templateId);
      }
    } else {
      this.templateMessage.set(result.error ?? 'Unable to create template.');
    }
  }

  async createField(): Promise<void> {
    this.fieldMessage.set(null);
    if (this.fieldForm.invalid) {
      this.fieldMessage.set('Fill out required field details.');
      return;
    }
    const {
      studyId,
      formTemplateId,
      key,
      label,
      type,
      required,
      optionsJson,
      validationJson,
      orderIndex,
    } = this.fieldForm.getRawValue();
    const optionsParse = this.parseJsonInput(optionsJson);
    const validationParse = this.parseJsonInput(validationJson);
    if (!optionsParse.ok || !validationParse.ok) {
      this.fieldMessage.set(optionsParse.error ?? validationParse.error ?? 'Invalid JSON input.');
      return;
    }
    const result = await this.engineService.createFormField(studyId, Number(formTemplateId), {
      key,
      label,
      type,
      required,
      options: optionsParse.value,
      validation: validationParse.value,
      order_index: Number(orderIndex),
    });
    this.fieldResult.set(result);
    if (!result.ok) {
      this.fieldMessage.set(result.error ?? 'Unable to create field.');
    }
  }

  async createLogic(): Promise<void> {
    this.logicMessage.set(null);
    if (this.logicForm.invalid) {
      this.logicMessage.set('Fill out required logic details.');
      return;
    }
    const { studyId, formTemplateId, logicJson, orderIndex } = this.logicForm.getRawValue();
    const logicParse = this.parseJsonInput(logicJson);
    if (!logicParse.ok) {
      this.logicMessage.set(logicParse.error ?? 'Invalid logic JSON.');
      return;
    }
    const result = await this.engineService.createFormLogic(studyId, Number(formTemplateId), {
      logic: logicParse.value,
      order_index: Number(orderIndex),
    });
    this.logicResult.set(result);
    if (!result.ok) {
      this.logicMessage.set(result.error ?? 'Unable to create logic rule.');
    }
  }

  private parseJsonInput(value: string): { ok: boolean; value?: unknown; error?: string } {
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
