import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverHighlight]',
  standalone: true
})
export class HoverHighlightDirective {
  @Input() highlightColor = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.highlightColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
}

/*
EJEMPLO DE USO:

import { Component } from '@angular/core';
import { HoverHighlightDirective } from 'src/app/shared/directives/hover-highlight.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-some-page',
  standalone: true,
  imports: [CommonModule, HoverHighlightDirective],
  template: `
    <div appHoverHighlight [highlightColor]="'lightblue'">
      Pasa el cursor por aquí para resaltar
    </div>
  `
})
export class SomePageComponent {}


*/