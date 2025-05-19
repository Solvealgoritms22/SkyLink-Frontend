// Angular 19 Stand‑alone UI mock‑ups for the Flight Reservation System
// Frameworks: Angular 19, Tailwind CSS (utility classes), PrimeNG 19 components
// Purpose: purely illustrative HTML – *no* business logic, data‑binding or services.

/* =============================================================
   1. Listado de vuelos públicos (UsuarioNoRegistrado / Cliente)
   =============================================================*/
   import { Component } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { TableModule } from 'primeng/table';
   import { ButtonModule } from 'primeng/button';
   import { CardModule } from 'primeng/card';
   
   @Component({
    selector: 'app-view-flights',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, CardModule],
    template: `
      <p-card class="rounded-2xl p-6">
        <h2 class="text-xl font-semibold mb-4">Vuelos disponibles</h2>
        <p-table [value]="flights" class="text-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Asientos</th>
              <th></th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vuelo>
            <tr>
              <td>{{ vuelo.origen }}</td>
              <td>{{ vuelo.destino }}</td>
              <td>{{ vuelo.fechaSalida | date:'dd/MM/yyyy' }}</td>
              <td>{{ vuelo.horaSalida }}</td>
              <td>{{ vuelo.asientosDisponibles }}</td>
              <td>
                <button pButton type="button" label="Seleccionar" class="p-button-sm"></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
        <div class="mt-6 flex justify-end gap-4">
          <button pButton label="Iniciar sesión" class="p-button-text"></button>
          <button pButton label="Registrarse" class="p-button-primary"></button>
        </div>
      </p-card>
    `,
  })
  export class ViewFlightsComponent {
    flights = [
      { origen: 'SDQ', destino: 'EWR', fechaSalida: new Date('2025-06-01'), horaSalida: '10:30', asientosDisponibles: 25 },
      { origen: 'SDQ', destino: 'MIA', fechaSalida: new Date('2025-06-02'), horaSalida: '14:15', asientosDisponibles: 5 },
      { origen: 'PUJ', destino: 'PAN', fechaSalida: new Date('2025-06-03'), horaSalida: '08:00', asientosDisponibles: 12 },
    ];
  }
   
