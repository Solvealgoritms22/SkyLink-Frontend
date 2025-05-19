import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
   
   /* =============================================================
      3. Inicio de sesión (cliente / agente)
      =============================================================*/
   @Component({
     selector: 'app-login',
     standalone: true,
     imports: [CommonModule, CardModule, InputTextModule, ButtonModule],
     template: `
       <div class="flex items-center justify-center min-h-screen dark:bg-surface-900">
         <p-card class="w-full max-w-md p-8 rounded-2xl">
           <h2 class="text-2xl font-semibold mb-6 text-center">Iniciar sesión</h2>
           <div class="flex flex-col gap-4">
             <input pInputText type="email" placeholder="Correo electrónico" class="w-full" />
             <input pInputText type="password" placeholder="Contraseña" class="w-full" />
             <button pButton label="Entrar" class="p-button-primary w-full mt-2"></button>
           </div>
         </p-card>
       </div>
     `,
   })
   export class LoginComponent {}
   