import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clinical-scope-page',
  imports: [CommonModule],
  templateUrl: './clinical-scope.html',
  styleUrl: './clinical-scope.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalScopePageComponent {}
