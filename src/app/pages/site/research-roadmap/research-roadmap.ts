import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-research-roadmap-page',
  imports: [CommonModule],
  templateUrl: './research-roadmap.html',
  styleUrl: './research-roadmap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchRoadmapPageComponent {}
