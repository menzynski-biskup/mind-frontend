// src/app/core/patient.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export interface Patient {
  id: string;
  name: string;
  date_birth: Date | null;
  sex: string | null;
  last_assessment: Date | null; // ISO date
  status: string | null;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  async getPatients(): Promise<Patient[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading patients (Supabase returned error):', error);
        return [];
      }

      return (data as Patient[]) ?? [];
    } catch (err) {
      console.error('Error loading patients (exception):', err);
      return [];
    }
  }

  async addPatient(patient: Omit<Patient, 'id'>): Promise<void> {
    try {
      const { error } = await supabase.from('patients').insert(patient);
      if (error) {
        console.error('Error adding patient (Supabase returned error):', error);
        throw error;
      }
    } catch (err) {
      console.error('Error adding patient (exception):', err);
      throw err;
    }
  }
}