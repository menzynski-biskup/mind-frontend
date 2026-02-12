import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationOpenScienceViewModel } from './collaboration-open-science.viewmodel';

@Component({
  selector: 'app-collaboration-open-science-page',
  imports: [CommonModule],
  templateUrl: './collaboration-open-science.html',
  styleUrl: './collaboration-open-science.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollaborationOpenScienceViewModel],
})
export class CollaborationOpenSciencePageComponent {
  protected readonly vm = inject(CollaborationOpenScienceViewModel);
}
