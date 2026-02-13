import { Injectable } from '@angular/core';

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudyEngineService {
  private readonly API_BASE_URL = '/api';

  async createFormTemplate(
    studyId: string,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(`/studies/${encodeURIComponent(studyId)}/forms`, payload);
  }

  async createFormField(
    studyId: string,
    formId: number,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(
      `/studies/${encodeURIComponent(studyId)}/forms/${formId}/fields`,
      payload
    );
  }

  async createFormLogic(
    studyId: string,
    formId: number,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(
      `/studies/${encodeURIComponent(studyId)}/forms/${formId}/logic`,
      payload
    );
  }

  async createComputeDefinition(
    studyId: string,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(`/studies/${encodeURIComponent(studyId)}/compute-definitions`, payload);
  }

  async createRuleSet(
    studyId: string,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(`/studies/${encodeURIComponent(studyId)}/rule-sets`, payload);
  }

  async submitIntake(
    studyId: string,
    participantId: string,
    payload: Record<string, unknown>
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.post(
      `/studies/${encodeURIComponent(studyId)}/participants/${encodeURIComponent(participantId)}/intake-submit`,
      payload
    );
  }

  async fetchIntakeResult(
    studyId: string,
    participantId: string
  ): Promise<ApiResult<Record<string, unknown>>> {
    return this.get(
      `/studies/${encodeURIComponent(studyId)}/participants/${encodeURIComponent(participantId)}/intake-result`
    );
  }

  private async post<T>(path: string, payload: Record<string, unknown>): Promise<ApiResult<T>> {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async get<T>(path: string): Promise<ApiResult<T>> {
    return this.request(path, { method: 'GET' });
  }

  private async request<T>(path: string, init: RequestInit): Promise<ApiResult<T>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers ?? {}),
        },
        credentials: 'include',
      });
      const data = (await response.json()) as T & { error?: string };
      if (!response.ok) {
        return { ok: false, error: data?.error ?? 'Request failed', data };
      }
      return { ok: true, data };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
