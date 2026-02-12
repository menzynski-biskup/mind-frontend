import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalScopeViewModel } from './clinical-scope.viewmodel';

@Component({
  selector: 'app-clinical-scope-page',
  imports: [CommonModule],
  templateUrl: './clinical-scope.html',
  styleUrl: './clinical-scope.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClinicalScopeViewModel],
})
export class ClinicalScopePageComponent {
  protected readonly vm = inject(ClinicalScopeViewModel);
}
