import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchUpdatesViewModel } from './research-updates.viewmodel';

@Component({
  selector: 'app-research-updates-page',
  imports: [CommonModule],
  templateUrl: './research-updates.html',
  styleUrl: './research-updates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [ResearchUpdatesViewModel],
})
export class ResearchUpdatesPageComponent {
  protected readonly vm = inject(ResearchUpdatesViewModel);
}
