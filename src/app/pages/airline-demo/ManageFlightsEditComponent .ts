import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-flights-edit',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    FormsModule
  ],
  template: `
<p-card class="p-8 rounded-2xl max-w-3xl mx-auto">
  <h2 class="text-xl font-semibold mb-6">Editar vuelo SDQ → EWR</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <!-- Origen -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Origen</span>
      <input pInputText value="SDQ" />
    </label>

    <!-- Destino -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Destino</span>
      <input pInputText value="JFK" />
    </label>

    <!-- Fecha de salida -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Fecha de salida</span>
      <p-calendar
        [(ngModel)]="flightDate"
        dateFormat="dd/mm/yy"
      ></p-calendar>
    </label>

    <!-- Hora -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Hora (HH:mm)</span>
      <input pInputText value="10:30" />
    </label>

    <!-- Asientos disponibles -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Asientos disponibles</span>
      <input pInputText value="150" />
    </label>

    <!-- Precio -->
    <label class="flex flex-col gap-1 text-sm font-medium">
      <span>Precio (USD)</span>
      <input pInputText value="420" />
    </label>
  </div>

  <div class="flex justify-end gap-3">
    <button
      pButton
      label="Eliminar"
      icon="pi pi-trash"
      class="p-button-danger p-button-outlined"
    ></button>
    <button pButton label="Cancelar" class="p-button-text"></button>
    <button
      pButton
      label="Guardar cambios"
      icon="pi pi-check"
      class="p-button-success"
    ></button>
  </div>
</p-card>

  `
})
export class ManageFlightsEditComponent {
  flightDate = new Date('2025-06-01');
}
