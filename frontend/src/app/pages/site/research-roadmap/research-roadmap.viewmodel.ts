import { inject, Injectable } from '@angular/core';
import { ContentService } from '../../../content/content.service';

@Injectable()
export class ResearchRoadmapViewModel {
  private readonly content = inject(ContentService);
  readonly page = this.content.getPageContent('roadmap');
}
