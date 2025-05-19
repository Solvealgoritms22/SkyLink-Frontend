  
   import { Component } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { ButtonModule } from 'primeng/button';
   import { CardModule } from 'primeng/card';
   
  /* =============================================================
      5. Estado de reserva pendiente (correo con link de pago)
      =============================================================*/
   @Component({
     selector: 'app-booking-pending',
     standalone: true,
     imports: [CommonModule, CardModule, ButtonModule],
     template: `
       <p-card class="p-6 rounded-2xl text-center">
         <h2 class="text-xl font-semibold mb-2 text-primary-700">Reserva pendiente de pago</h2>
         <p class="mb-4">Se ha enviado un enlace de pago a tu correo. Completa el pago para confirmar tu vuelo.</p>
         <button pButton label="Volver al inicio" class="p-button-text"></button>
       </p-card>
     `,
   })
   export class BookingPendingComponent {}