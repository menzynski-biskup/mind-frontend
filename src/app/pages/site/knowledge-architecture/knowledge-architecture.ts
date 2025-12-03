import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-knowledge-architecture-page',
  imports: [CommonModule],
  templateUrl: './knowledge-architecture.html',
  styleUrl: './knowledge-architecture.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeArchitecturePageComponent {}
