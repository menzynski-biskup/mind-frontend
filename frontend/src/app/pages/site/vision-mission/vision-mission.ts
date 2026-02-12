import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisionMissionViewModel } from './vision-mission.viewmodel';

@Component({
  selector: 'app-vision-mission-page',
  imports: [CommonModule],
  templateUrl: './vision-mission.html',
  styleUrl: './vision-mission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VisionMissionViewModel],
})
export class VisionMissionPageComponent {
  protected readonly vm = inject(VisionMissionViewModel);
}
