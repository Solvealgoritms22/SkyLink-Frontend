import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
   
   /* =============================================================
      2. Formulario de registro
      =============================================================*/
   @Component({
     selector: 'app-register',
     standalone: true,
     imports: [CommonModule, CardModule, InputTextModule, ButtonModule],
     template: `
       <div class="flex items-center justify-center min-h-screen dark:bg-surface-900">
         <p-card class="w-full max-w-md p-8 rounded-2xl">
           <h2 class="text-2xl font-semibold mb-6 text-center">Crear cuenta</h2>
   
           <div class="flex flex-col gap-4">
             <input pInputText type="text" placeholder="Nombre completo" class="w-full" />
             <input pInputText type="email" placeholder="Correo electrónico" class="w-full" />
             <input pInputText type="tel" placeholder="Teléfono" class="w-full" />
             <input pInputText type="password" placeholder="Contraseña" class="w-full" />
   
             <button pButton label="Registrarme" class="p-button-primary w-full mt-2"></button>
           </div>
         </p-card>
       </div>
     `,
   })
   export class RegisterComponent {}