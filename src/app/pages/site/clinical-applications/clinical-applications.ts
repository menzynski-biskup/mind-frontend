import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalApplicationsViewModel } from './clinical-applications.viewmodel';

@Component({
  selector: 'app-clinical-applications-page',
  imports: [CommonModule],
  templateUrl: './clinical-applications.html',
  styleUrl: './clinical-applications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ClinicalApplicationsViewModel],
})
export class ClinicalApplicationsPageComponent {
  protected readonly vm = inject(ClinicalApplicationsViewModel);
}
