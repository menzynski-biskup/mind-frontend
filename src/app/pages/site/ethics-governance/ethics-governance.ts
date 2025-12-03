import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ethics-governance-page',
  imports: [CommonModule],
  templateUrl: './ethics-governance.html',
  styleUrl: './ethics-governance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EthicsGovernancePageComponent {}
