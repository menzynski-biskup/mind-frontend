import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScientificScopeViewModel } from './scientific-scope.viewmodel';

@Component({
  selector: 'app-scientific-scope-page',
  imports: [CommonModule],
  templateUrl: './scientific-scope.html',
  styleUrl: './scientific-scope.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ScientificScopeViewModel],
})
export class ScientificScopePageComponent {
  protected readonly vm = inject(ScientificScopeViewModel);
}
