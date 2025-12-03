import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publications-page',
  imports: [CommonModule],
  templateUrl: './publications.html',
  styleUrl: './publications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsPageComponent {}
