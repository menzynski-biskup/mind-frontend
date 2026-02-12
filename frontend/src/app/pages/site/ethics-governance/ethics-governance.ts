import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthicsGovernanceViewModel } from './ethics-governance.viewmodel';

@Component({
  selector: 'app-ethics-governance-page',
  imports: [CommonModule],
  templateUrl: './ethics-governance.html',
  styleUrl: './ethics-governance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EthicsGovernanceViewModel],
})
export class EthicsGovernancePageComponent {
  protected readonly vm = inject(EthicsGovernanceViewModel);
}
