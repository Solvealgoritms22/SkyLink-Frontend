import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, CardModule, InputTextModule, ButtonModule],
  template: `
    <div class="items-center flex justify-center min-h-screen dark:bg-surface-900 px-4">
      <!-- Contenedor principal -->
      <p-card class="w-full max-w-lg p-8 rounded-2xl space-y-8">
        <!-- Título -->
        <h2 class="text-2xl font-semibold text-center">Pago de reserva</h2>

        <!-- Vista previa de la tarjeta -->
         <div class="flex justify-center">
        <div
          class="w-2/3 mb-4 h-40 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 flex flex-col justify-between shadow-inner"
        >
          <div class="flex justify-between items-center">
            <span class="uppercase tracking-wider text-xs">Tarjeta crédito</span>
            <i class="pi pi-credit-card text-xl"></i>
          </div>

          <div class="text-lg tracking-widest">
            4111&nbsp;1111&nbsp;1111&nbsp;1111
          </div>

          <div class="flex justify-between text-xs">
            <div>
              <span class="block uppercase opacity-70">Nombre</span>
              <span>Darling Fajardo</span>
            </div>
            <div>
              <span class="block uppercase opacity-70">Expira</span>
              <span>12/27</span>
            </div>
          </div>
        </div>
        </div>

        <!-- Formulario -->
        <div class="flex flex-col gap-4">
          <input
            pInputText
            type="text"
            placeholder="Nombre en la tarjeta"
            class="w-full"
          />
          <input
            pInputText
            type="text"
            placeholder="Número de tarjeta"
            class="w-full"
          />
          <div class="grid grid-cols-2 gap-4">
            <input pInputText type="text" placeholder="Exp. MM/AA" />
            <input pInputText type="text" placeholder="CVV" />
          </div>
          <button
            pButton
            label="Pagar $430"
            icon="pi pi-lock"
            class="p-button-success w-full mt-2"
          ></button>
        </div>
      </p-card>
    </div>
  `,
})
export class PaymentFormComponent {}
