import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
  template: `
    <button
      pButton
      [disabled]="loading || disabled"
      (click)="onClick()"
      [label]="loading ? '' : label"
      [icon]="loading ? '' : icon"
      [ngClass]="styleClass"
      [type]="type"
    >
      <!-- Si está cargando, mostramos el spinner dentro del botón -->
      <ng-container *ngIf="loading">
        <p-progressSpinner
          styleClass="spinner-button-loader"
          strokeWidth="3"
          animationDuration=".5s"
        ></p-progressSpinner>
      </ng-container>
    </button>
  `,
  styleUrls: ['./spinner-button.component.scss']
})
export class SpinnerButtonComponent {
  /**
   * Texto del botón.
   */
  @Input() label: string = 'Sign In';

  /**
   * Indica si se muestra el spinner y se deshabilita el botón.
   */
  @Input() loading: boolean = false;

  /**
   * Si deseas deshabilitar el botón aunque no esté en loading.
   */
  @Input() disabled: boolean = false;

  /**
   * Clase CSS opcional para personalizar estilos.
   */
  @Input() styleClass: string = 'p-button-primary';

  /**
   * Icono de PrimeNG si no está en modo loading (por ej. 'pi pi-check').
   */
  @Input() icon: string = 'pi pi-check';

  /**
   * Tipo de botón (button, submit, etc.)
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Emite evento al hacer click (cuando no está loading).
   */
  @Output() clickEvent = new EventEmitter<void>();

  onClick() {
    if (!this.loading) {
      this.clickEvent.emit();
    }
  }
}
