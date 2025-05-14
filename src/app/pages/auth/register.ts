import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '../../core/services/app-config.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule, Tooltip, CheckboxModule, InputTextModule,
    PasswordModule, FormsModule, RouterModule, RippleModule,
    TranslateModule, AppFloatingConfigurator, MessageModule, CommonModule
  ],
  template: `
    <app-floating-configurator />

    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center">
        <div style="border-radius:56px;padding:.3rem;background:linear-gradient(180deg,var(--primary-color) 10%,rgba(33,150,243,0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius:53px">
            <!-- LOGO + TÍTULO -->
            <div class="text-center mb-8">
              <span [innerHTML]="sanitizedLogo" class="mb-4"></span>
              <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-2">
                {{ 'REGISTER_TITLE' | translate:{ appName: configService.appName } }}
              </div>
              <span class="text-muted-color font-medium">
                {{ 'REGISTER_SUBTITLE' | translate }}
              </span>
            </div>

            <!-- MENSAJE DE ERROR / INFO -->
            <p-message *ngIf="visibleMsg()" severity="warn"
                       [text]="msgText" styleClass="block mb-4"></p-message>

            <!-- FORMULARIO -->
            <div class="grid gap-6">
              <!-- Nombre -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                    {{ 'FIRST_NAME' | translate }}
                  </label>
                  <input pInputText type="text" [(ngModel)]="firstName"
                         class="w-full" placeholder="John" />
                </div>
                <div>
                  <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                    {{ 'LAST_NAME' | translate }}
                  </label>
                  <input pInputText type="text" [(ngModel)]="lastName"
                         class="w-full" placeholder="Doe" />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                  {{ 'EMAIL' | translate }}
                </label>
                <input pInputText type="email" [(ngModel)]="email"
                       class="w-full" placeholder="john@ejemplo.com" />
              </div>

              <!-- Password + Confirm -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                    {{ 'PASSWORD' | translate }}
                  </label>
                  <p-password [(ngModel)]="password" [feedback]="false"
                              [toggleMask]="true" placeholder="********" />
                </div>
                <div>
                  <label class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                    {{ 'CONFIRM_PASSWORD' | translate }}
                  </label>
                  <p-password [(ngModel)]="confirmPassword" [feedback]="false"
                              [toggleMask]="true" placeholder="********" />
                </div>
              </div>

              <!-- Aceptar términos -->
              <div class="flex items-center gap-2">
                <p-checkbox [(ngModel)]="acceptTerms" [binary]="true"></p-checkbox>
                <span>
                  {{ 'ACCEPT_TERMS' | translate }}
                </span>
              </div>

              <!-- BOTONES -->
              <button
                pButton
                type="button"
                label="{{ 'BUTTON_SIGNUP' | translate }}"
                class="p-button-primary w-full"
                [disabled]="isLoading || !formValid()"
                (click)="onRegister()"
              ></button>

              <div class="text-center text-sm mt-2">
                {{ 'ALREADY_HAVE_ACCOUNT' | translate }}
                <a routerLink="/auth/login" class="text-primary hover:underline">
                  {{ 'BUTTON_SIGNIN' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón flotante a landing -->
    <button pButton icon="pi pi-home" pTooltip="{{ 'GO_LANDING' | translate }}"
            tooltipPosition="right" class="floating-btn"
            routerLink="/"></button>
  `,
  styles: [`
    .floating-btn {
      position: fixed; top: 2rem; left: 1rem; border-radius: 50%;
      width: 2.5rem; height: 2.5rem; z-index: 10000;
    }
  `]
})
export class RegisterUiOnly {

  sanitizedLogo: any;

  /* campos de formulario */
  firstName = '';
  lastName  = '';
  email     = '';
  password  = '';
  confirmPassword = '';
  acceptTerms = false;

  /* estado UI */
  isLoading  = false;
  msgText    = '';
  visibleMsg = signal(false);

  constructor(
    public  configService: AppConfigService,
    private router       : Router,
    private sanitizer    : DomSanitizer
  ) {
    this.sanitizedLogo = this.sanitizer
      .bypassSecurityTrustHtml(this.configService.appLogoLogin);
  }

  /** Devuelve true si el formulario está completo y coherente */
  formValid(): boolean | string {
    return (
      this.firstName.trim() &&
      this.lastName.trim()  &&
      this.email.trim()     &&
      this.password         &&
      this.password === this.confirmPassword &&
      this.acceptTerms
    );
  }

  /** Placeholder sin lógica real */
  onRegister() {
    this.msgText = 'Funcionalidad de registro pendiente.';
    this.visibleMsg.set(true);
    setTimeout(() => this.visibleMsg.set(false), 3500);
  }
}
