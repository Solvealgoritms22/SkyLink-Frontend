/* -----------------------------------------------------------------------------
   Reusable CodeCardComponent – PrismJS + PrimeNG Button
   ----------------------------------------------------------------------------- */

import { Component, AfterViewInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import Prism from 'prismjs';

@Component({
  selector: 'app-code-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  template: `
    <div class="border border-surface-600 rounded-xl overflow-hidden shadow-md
                hover:-translate-y-0.5 transition">
      <header class="flex items-center justify-between gap-2 bg-surface-700 px-4 py-2 select-none">
        <div class="flex items-center gap-2">
          <i class="pi pi-code text-primary-300"></i>
          <span class="font-mono text-xs text-surface-100">{{ language }}</span>
        </div>
        <button type="button" pButton
                class="p-button-text text-xs h-8 px-3"
                (click)="copy.emit(code)">
          <i class="pi pi-copy mr-1"></i> Copiar
        </button>
      </header>

      <pre class="m-0 p-4 bg-surface-800 overflow-x-auto text-sm leading-6 font-mono line-numbers">
<code [class]="'language-' + language">{{ code }}</code></pre>
    </div>
  `
})
export class CodeCardComponent implements AfterViewInit {
  @Input() language: string = 'sql';
  @Input() code: string = '';
  @Output() copy = new EventEmitter<string>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    Prism.highlightAllUnder(this.el.nativeElement);
  }
}
