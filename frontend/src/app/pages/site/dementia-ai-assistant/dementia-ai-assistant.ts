import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DementiaAiAssistantViewModel } from './dementia-ai-assistant.viewmodel';

@Component({
  selector: 'app-dementia-ai-assistant-page',
  imports: [CommonModule],
  templateUrl: './dementia-ai-assistant.html',
  styleUrl: './dementia-ai-assistant.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [DementiaAiAssistantViewModel],
})
export class DementiaAiAssistantPageComponent {
  protected readonly vm = inject(DementiaAiAssistantViewModel);
}
