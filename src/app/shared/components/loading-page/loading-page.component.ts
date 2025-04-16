import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-page',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent {
  /**
   * Controla si se muestra o no la pantalla de carga.
   */
  @Input() loading: boolean = false;

  /**
   * Mensaje opcional a mostrar debajo del spinner.
   */
  @Input() message: string = 'Loading...';
}


/*
EJEMPLO DE USO:

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from 'src/app/shared/components/loading-page/loading-page.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingPageComponent],
  template: `
    <button (click)="simulateLoading()">Simular Carga</button>

    <app-loading-page
      [loading]="isLoading"
      [message]="'Cargando datos...'"
    ></app-loading-page>
  `
})
export class DashboardComponent {
  isLoading: boolean = false;

  simulateLoading() {
    this.isLoading = true;
    // Simula una operación asíncrona de 3 seg.
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
}

*/