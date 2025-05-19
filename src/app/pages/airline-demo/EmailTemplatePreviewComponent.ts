import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-email-template-preview',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card class="max-w-lg mx-auto p-8 rounded-2xl">
      <div class="text-center">
        <!-- Logo -->
        <img
          src="assets/logos/skylink/skylink-logo-3.png"
          alt="Airline Logo"
          class="w-44 mx-auto mb-6"
        />

        <h2 class="text-2xl font-bold mb-2">¡Reserva confirmada!</h2>

        <p class="mb-6">
          Hola <strong>Darling Fajardo</strong>,<br />
          Tu vuelo <strong>SDQ → EWR</strong> para el
          <strong>05 August 2025&nbsp;–&nbsp;01:00 PM</strong> está pendiente de
          pago.
        </p>

        <!-- Botón-enlace con link de pago generado -->
        <a
          [href]="paymentLink"
          target="_blank"
          rel="noopener"
          class="p-button p-component p-button-success inline-flex justify-center"
        >
          <span class="p-button-label">Pagar ahora</span>
        </a>

        <p class="mt-6 text-xs text-gray-500">
          © 2025 Skylink Airlines • Todos los derechos reservados
        </p>
      </div>
    </p-card>
  `,
})
export class EmailTemplatePreviewComponent {
  // Link de pago generado dinámicamente por tu backend
  paymentLink = 'https://pago.skylink.do/AB94495965661';
}
