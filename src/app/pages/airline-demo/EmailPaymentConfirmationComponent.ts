import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-email-payment-confirmation',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card class="max-w-lg mx-auto p-8 rounded-2xl">
      <!-- Logo (ajusta la ruta a tu asset real) -->
      <div class="flex justify-left mb-6">
        <img src="assets/logos/skylink/skylink-logo-3.png" alt="Airline Logo" class="w-48" />
      </div>

      <h2 class="text-2xl font-bold text-center mb-4">
        ¡Pago confirmado!
      </h2>

      <p class="text-center mb-6">
        Gracias <strong>Darling Fajardo</strong>. Tu vuelo <strong>SDQ → EWR</strong>
        para el <strong>05 August 2025 - 10:30 AM</strong> ha sido pagado con éxito.
      </p>

      <!-- Resumen / Boarding Pass -->
      <div
        class="bg-slate-100 rounded-xl p-6 border border-dashed border-slate-300 shadow-inner relative"
      >
        <!-- Perforation circles -->
        <span
          class="absolute -left-3 top-10 w-6 h-6 bg-white rounded-full border border-slate-300"
        ></span>
        <span
          class="absolute -right-3 top-10 w-6 h-6 bg-white rounded-full border border-slate-300"
        ></span>

        <h3 class="text-lg font-semibold mb-4">Resumen de vuelo</h3>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="block uppercase text-xs text-slate-500">Pasajero</span>
            Darling Fajardo
          </div>
          <div>
            <span class="block uppercase text-xs text-slate-500">Vuelo</span>
            AB94495965661
          </div>
          <div>
            <span class="block uppercase text-xs text-slate-500">Origen</span>
            Santo Domingo – Las Américas (SDQ)
          </div>
          <div>
            <span class="block uppercase text-xs text-slate-500">Destino</span>
            Newark – Liberty International (EWR)
          </div>
          <div>
            <span class="block uppercase text-xs text-slate-500">Fecha</span>
            05/08/2025
          </div>
          <div>
            <span class="block uppercase text-xs text-slate-500">Hora</span>
            01:00 PM
          </div>
        </div>

        <!-- Código (estilo boarding pass) -->
        <div
          class="mt-6 text-center tracking-widest font-mono text-base bg-white p-3 rounded-md border border-slate-200"
        >
           AB94495965661
        </div>
      </div>

      <!-- Call-to-action -->
      <div class="mt-8 text-center">
        <button
          pButton
          label="Descargar PDF"
          icon="pi pi-download"
          class="p-button-primary"
        ></button>
      </div>

      <p class="mt-6 text-xs text-gray-500 text-center">
        © 2025 Skylink Airlines • Todos los derechos reservados
      </p>
    </p-card>
  `,
})
export class EmailPaymentConfirmationComponent {}
