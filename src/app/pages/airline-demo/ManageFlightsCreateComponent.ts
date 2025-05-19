import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-manage-flights-create',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    ButtonModule
  ],
  template: `
    <p-card class="p-8 rounded-2xl max-w-3xl mx-auto">
      <h2 class="text-xl font-semibold mb-6">Agregar nuevo vuelo</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input pInputText placeholder="Origen" />
        <input pInputText placeholder="Destino" />
        <p-calendar
          placeholder="Fecha de salida"
          dateFormat="dd/mm/yy"></p-calendar>
        <input pInputText placeholder="Hora (HH:mm)" />
        <input pInputText placeholder="Asientos disponibles" />
        <input pInputText placeholder="Precio (USD)" />
      </div>

      <div class="flex justify-end gap-3">
        <button pButton
                label="Cancelar"
                class="p-button-text"></button>
        <button pButton
                label="Guardar"
                icon="pi pi-check"
                class="p-button-success"></button>
      </div>
    </p-card>
  `
})
export class ManageFlightsCreateComponent {}
