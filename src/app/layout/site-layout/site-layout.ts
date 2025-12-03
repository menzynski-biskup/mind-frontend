import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type NavLink = {
  path: string;
  label: string;
  future?: boolean;
};

type NavGroup = {
  label: string;
  primary: NavLink;
  children?: NavLink[];
};

@Component({
  selector: 'app-site-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './site-layout.html',
  styleUrl: './site-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'handleDocumentClick($event)'
  },
})
export class SiteLayoutComponent {
  protected readonly menuOpen = signal(false);
  protected readonly openGroup = signal<number | null>(null);
  private readonly hostRef = inject(ElementRef) as ElementRef<HTMLElement>;

  protected readonly navGroups: NavGroup[] = [
    { label: 'Home', primary: { path: '/', label: 'Home' } },
    {
      label: 'Vision & Scope',
      primary: { path: '/vision', label: 'Vision & Mission' },
      children: [
        { path: '/scientific', label: 'Scientific Scope' },
        { path: '/clinical', label: 'Clinical Scope' },
      ],
    },
    {
      label: 'Architecture',
      primary: { path: '/knowledge', label: 'Knowledge Architecture' },
      children: [
        { path: '/technology', label: 'Technology Stack' },
        { path: '/roadmap', label: 'Research Roadmap' },
      ],
    },
    {
      label: 'Governance',
      primary: { path: '/ethics', label: 'Ethics & Governance' },
    },
    {
      label: 'Collaboration',
      primary: { path: '/collaboration', label: 'Collaboration & Open Science' },
      children: [
        { path: '/publications', label: 'Publications / Preprints', future: true },
        { path: '/team', label: 'Team', future: true },
      ],
    },
    { label: 'Contact', primary: { path: '/contact', label: 'Contact' } },
  ];

  toggleMenu(): void {
    this.menuOpen.update((state) => !state);
    if (!this.menuOpen()) {
      this.openGroup.set(null);
    }
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.openGroup.set(null);
  }

  closeGroup(): void {
    this.openGroup.set(null);
  }

  isGroupOpen(index: number): boolean {
    return this.openGroup() === index;
  }

  handlePrimaryNavLeave(event: MouseEvent): void {
    if (this.menuOpen()) {
      return;
    }
    const related = event.relatedTarget as HTMLElement | null;
    const nav = this.hostRef.nativeElement.querySelector<HTMLElement>('#site-navigation');
    if (related && nav?.contains(related)) {
      return;
    }
    this.openGroup.set(null);
  }

  handleGroupFocus(index: number): void {
    if (!this.menuOpen() && this.navGroups[index]?.children?.length) {
      this.openGroup.set(index);
    }
  }

  handleGroupPointerEnter(index: number): void {
    if (!this.menuOpen() && this.navGroups[index]?.children?.length) {
      this.openGroup.set(index);
    }
  }

  handleGroupKeydown(event: KeyboardEvent, index: number): void {
    if (!this.navGroups[index]?.children?.length) {
      return;
    }
    const key = event.key;
    if (key === 'ArrowDown') {
      event.preventDefault();
      if (this.openGroup() !== index) {
        this.openGroup.set(index);
      }
      requestAnimationFrame(() => this.focusFirstItem(index));
    }
    if (key === 'ArrowUp') {
      event.preventDefault();
      this.openGroup.set(index);
      requestAnimationFrame(() => this.focusLastItem(index));
    }
    if (key === 'Escape') {
      this.closeGroup();
    }
  }

  handleSubmenuFocusOut(event: FocusEvent, index: number): void {
    if (this.menuOpen()) {
      return;
    }
    const related = event.relatedTarget as HTMLElement | null;
    if (!related || !this.hostRef.nativeElement.contains(related)) {
      this.openGroup.set(null);
    }
  }

  private focusFirstItem(index: number): void {
    const submenu = this.hostRef.nativeElement.querySelector<HTMLUListElement>(`#submenu-${index}`);
    submenu?.querySelector<HTMLAnchorElement>('a')?.focus();
  }

  private focusLastItem(index: number): void {
    const submenu = this.hostRef.nativeElement.querySelector<HTMLUListElement>(`#submenu-${index}`);
    const links = submenu?.querySelectorAll<HTMLAnchorElement>('a');
    if (links && links.length > 0) {
      links[links.length - 1].focus();
    }
  }

  handleDocumentClick(event: MouseEvent): void {
    if (!this.hostRef.nativeElement.contains(event.target as Node)) {
      this.openGroup.set(null);
      this.menuOpen.set(false);
    }
  }

  toggleGroup(index: number): void {
    if (!this.navGroups[index]?.children?.length) {
      this.closeGroup();
      return;
    }
    this.openGroup.update((current) => (current === index ? null : index));
  }
}
