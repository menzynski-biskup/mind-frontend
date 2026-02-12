import { Injectable, computed, signal } from '@angular/core';
import { SITE_CONTENT } from './site-content';
import { NavItem, PageContent, SiteContent } from './site-content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  #content = signal<SiteContent>(SITE_CONTENT);

  readonly nav = computed<NavItem[]>(() => this.#content().nav);
  readonly footer = computed(() => this.#content().footer);
  readonly pages = computed(() => this.#content().pages);

  getPageContent<K extends keyof SiteContent['pages']>(page: K): PageContent {
    return this.#content().pages[page];
  }
}
