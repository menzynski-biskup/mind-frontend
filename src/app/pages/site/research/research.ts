import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchViewModel } from './research.viewmodel';

@Component({
  selector: 'app-research-page',
  imports: [CommonModule],
  templateUrl: './research.html',
  styleUrl: './research.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ResearchViewModel],
})
export class ResearchPageComponent {
  protected readonly vm = inject(ResearchViewModel);
}
