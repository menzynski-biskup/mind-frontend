import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vision-mission-page',
  imports: [CommonModule],
  templateUrl: './vision-mission.html',
  styleUrl: './vision-mission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisionMissionPageComponent {}
