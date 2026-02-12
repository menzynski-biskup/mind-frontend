import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KnowledgeArchitectureViewModel } from './knowledge-architecture.viewmodel';

@Component({
  selector: 'app-knowledge-architecture-page',
  imports: [CommonModule],
  templateUrl: './knowledge-architecture.html',
  styleUrl: './knowledge-architecture.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KnowledgeArchitectureViewModel],
})
export class KnowledgeArchitecturePageComponent {
  protected readonly vm = inject(KnowledgeArchitectureViewModel);
}
