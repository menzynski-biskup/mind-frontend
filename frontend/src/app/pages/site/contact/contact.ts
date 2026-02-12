import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactViewModel } from './contact.viewmodel';

@Component({
  selector: 'app-contact-page',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContactViewModel],
})
export class ContactPageComponent {
  protected readonly vm = inject(ContactViewModel);
}
