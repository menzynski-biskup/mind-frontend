import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technology-stack-page',
  imports: [CommonModule],
  templateUrl: './technology-stack.html',
  styleUrl: './technology-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnologyStackPageComponent {}
