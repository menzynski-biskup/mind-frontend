// src/app/core/patient.service.ts
import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export interface Patient {
  id: string;
  name: string;
  age: number | null;
  sex: string | null;
  last_assessment: string | null; // ISO date
  status: string | null;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  async getPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading patients:', error);
      return [];
    }

    return data as Patient[];
  }

  async addPatient(patient: Omit<Patient, 'id'>): Promise<void> {
    const { error } = await supabase.from('patients').insert(patient);
    if (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  }
}