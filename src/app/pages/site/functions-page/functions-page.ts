import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionsPageViewModel } from './functions-page.viewmodel';

@Component({
  selector: 'app-functions-page',
  imports: [CommonModule],
  templateUrl: './functions-page.html',
  styleUrl: './functions-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FunctionsPageViewModel],
})
export class FunctionsPageComponent {
  protected readonly vm = inject(FunctionsPageViewModel);
}
