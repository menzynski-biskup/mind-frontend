import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRoadmapViewModel } from './research-roadmap.viewmodel';

@Component({
  selector: 'app-research-roadmap-page',
  imports: [CommonModule],
  templateUrl: './research-roadmap.html',
  styleUrl: './research-roadmap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResearchRoadmapViewModel],
})
export class ResearchRoadmapPageComponent {
  protected readonly vm = inject(ResearchRoadmapViewModel);
}
