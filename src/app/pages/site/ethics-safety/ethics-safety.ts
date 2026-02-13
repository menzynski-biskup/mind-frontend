import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthicsSafetyViewModel } from './ethics-safety.viewmodel';

@Component({
  selector: 'app-ethics-safety-page',
  imports: [CommonModule],
  templateUrl: './ethics-safety.html',
  styleUrl: './ethics-safety.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EthicsSafetyViewModel],
})
export class EthicsSafetyPageComponent {
  protected readonly vm = inject(EthicsSafetyViewModel);
}
