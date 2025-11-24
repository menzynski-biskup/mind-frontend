import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService, Patient } from '@core/patient.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-clinician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './clinician-dashboard.html',
  styleUrl: './clinician-dashboard.scss',
})
export class ClinicianDashboardComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  error: string | null = null;

  // simple form model
  newName = '';
  newAge: number | null = null;

  constructor(private patientService: PatientService) {}

  async ngOnInit() {
    await this.loadPatients();
  }

  async loadPatients() {
    this.loading = true;
    this.error = null;
    try {
      this.patients = await this.patientService.getPatients();
    } catch (e) {
      this.error = 'Could not load patients.';
    } finally {
      this.loading = false;
    }
  }

  async addPatient() {
    if (!this.newName) return;
    try {
      await this.patientService.addPatient({
        id: '' as any, // will be ignored by Supabase
        name: this.newName,
        age: this.newAge,
        sex: null,
        last_assessment: null,
        status: 'New',
      });
      this.newName = '';
      this.newAge = null;
      await this.loadPatients();
    } catch (e) {
      this.error = 'Could not add patient.';
    }
  }
}