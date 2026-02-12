import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageViewModel } from './about-page.viewmodel';

@Component({
  selector: 'app-about-page',
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [AboutPageViewModel],
})
export class AboutPageComponent {
  protected readonly vm = inject(AboutPageViewModel);
}
