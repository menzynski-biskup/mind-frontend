import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collaboration-open-science-page',
  imports: [CommonModule],
  templateUrl: './collaboration-open-science.html',
  styleUrl: './collaboration-open-science.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaborationOpenSciencePageComponent {}
