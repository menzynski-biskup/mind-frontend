import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    try {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error && error.stack ? error.stack : String(error);

      // Log to console as well
      // eslint-disable-next-line no-console
      console.error('Uncaught error:', error);

      // Create a visible overlay so deploy previews don't show a white screen
      const id = 'global-error-overlay';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        Object.assign(el.style, {
          position: 'fixed',
          left: '12px',
          right: '12px',
          bottom: '12px',
          padding: '12px',
          background: 'rgba(255, 240, 240, 0.95)',
          color: '#800',
          border: '1px solid #f00',
          borderRadius: '6px',
          zIndex: '999999',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: '60vh',
          overflow: 'auto',
        });
        document.body.appendChild(el);
      }

      el.textContent = `Application error: ${message}\n\n${stack}`;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error in GlobalErrorHandler:', e);
    }
  }
}
