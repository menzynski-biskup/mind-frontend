import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyStackViewModel } from './technology-stack.viewmodel';

@Component({
  selector: 'app-technology-stack-page',
  imports: [CommonModule],
  templateUrl: './technology-stack.html',
  styleUrl: './technology-stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TechnologyStackViewModel],
})
export class TechnologyStackPageComponent {
  protected readonly vm = inject(TechnologyStackViewModel);
}
