import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
   
   /* =============================================================
      4. Buscar vuelos (con filtros)
      =============================================================*/
      @Component({
        selector: 'app-search-flights',
        standalone: true,
        imports: [CommonModule, CardModule, DropdownModule, CalendarModule, ButtonModule],
        template: `
          <p-card class="p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-4">Buscar vuelo</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <p-dropdown [options]="origins" placeholder="Origen"></p-dropdown>
              <p-dropdown [options]="destinations" placeholder="Destino"></p-dropdown>
              <p-calendar dateFormat="dd/mm/yy" placeholder="Fecha"></p-calendar>
            </div>
            <div class="mt-6 text-right">
              <button pButton label="Buscar" class="p-button-primary"></button>
            </div>
          </p-card>
        `,
      })
      export class SearchFlightsComponent {
        origins = [
          { label: 'Santo Domingo (SDQ)', value: 'SDQ' },
          { label: 'Punta Cana (PUJ)', value: 'PUJ' },
        ];
        destinations = [
          { label: 'Nueva York (JFK)', value: 'JFK' },
          { label: 'Miami (MIA)', value: 'MIA' },
          { label: 'Panamá (PTY)', value: 'PTY' },
        ];
      }
   