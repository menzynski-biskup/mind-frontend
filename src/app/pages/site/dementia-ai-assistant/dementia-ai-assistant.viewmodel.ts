import { inject, Injectable } from '@angular/core';
import { ContentService } from '../../../content/content.service';

@Injectable()
export class DementiaAiAssistantViewModel {
  private readonly content = inject(ContentService);
  readonly page = this.content.getPageContent('dementia-ai-assistant');
}
