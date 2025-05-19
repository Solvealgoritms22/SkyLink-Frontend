import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
 
 /* =============================================================
      7. Listado y cancelación de reservaciones
      =============================================================*/
      @Component({
        selector: 'app-reservations',
        standalone: true,
        imports: [CommonModule, TableModule, ButtonModule, DialogModule, CardModule],
        template: `
          <p-card class="p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-4">Mis reservaciones</h2>
            <p-table [value]="reservations" class="text-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th>Vuelo</th>
                  <th>Fecha</th>
                  <th>Asiento</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-res>
                <tr>
                  <td>{{ res.vuelo }}</td>
                  <td>{{ res.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ res.asiento }}</td>
                  <td>{{ res.estado }}</td>
                  <td>
                    <button pButton label="Cancelar" class="p-button-danger p-button-sm"></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        `,
      })
      export class ReservationsComponent {
        reservations = [
          { vuelo: 'SDQ → EWR', fecha: new Date('2025-06-01T10:30:00'), asiento: '12A', estado: 'Agendada' },
          { vuelo: 'PUJ → PTY', fecha: new Date('2025-06-03T08:00:00'), asiento: '5C', estado: 'Pendiente pago' },
        ];
      }