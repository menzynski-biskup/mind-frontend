import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsViewModel } from './publications.viewmodel';

@Component({
  selector: 'app-publications-page',
  imports: [CommonModule],
  templateUrl: './publications.html',
  styleUrl: './publications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PublicationsViewModel],
})
export class PublicationsPageComponent {
  protected readonly vm = inject(PublicationsViewModel);
}
