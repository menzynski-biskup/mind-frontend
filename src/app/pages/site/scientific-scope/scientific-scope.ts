import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scientific-scope-page',
  imports: [CommonModule],
  templateUrl: './scientific-scope.html',
  styleUrl: './scientific-scope.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScientificScopePageComponent {}
