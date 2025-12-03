import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService, Patient } from '@core/patient.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-clinician-dashboard',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './clinician-dashboard.html',
  styleUrl: './clinician-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicianDashboardComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly patients = signal<Patient[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly hasPatients = computed(() => this.patients().length > 0);
  protected readonly showEmptyState = computed(
    () => !this.loading() && !this.error() && !this.hasPatients()
  );

  protected readonly addPatientForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    dateBirth: this.formBuilder.control<Date | null>(null),
  });

  async ngOnInit(): Promise<void> {
    await this.loadPatients();
  }

  async loadPatients(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const patientList = await this.patientService.getPatients();
      this.patients.set(patientList);
    } catch (error) {
      console.error('ClinicianDashboard: failed to load patients:', error);
      this.error.set('Could not load patients.');
    } finally {
      this.loading.set(false);
    }
  }

  async addPatient(): Promise<void> {
    if (this.addPatientForm.invalid) {
      this.addPatientForm.markAllAsTouched();
      return;
    }
    const { name, dateBirth } = this.addPatientForm.getRawValue();
    try {
      await this.patientService.addPatient({
        name,
        date_birth: dateBirth,
        sex: null,
        last_assessment: null,
        status: 'New',
      });
      this.addPatientForm.reset({ name: '', dateBirth: null });
      await this.loadPatients();
    } catch (error) {
      console.error('ClinicianDashboard: failed to add patient:', error);
      this.error.set('Could not add patient.');
    }
  }
}