import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-researcher-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './researcher-dashboard.html',
  styleUrl: './researcher-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherDashboardComponent {}