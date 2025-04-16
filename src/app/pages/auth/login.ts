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
import { AuthService } from '../../core/services/auth.service';
import { SpinnerButtonComponent } from '../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '../../core/services/app-config.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, Tooltip, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, SpinnerButtonComponent, TranslateModule, AppFloatingConfigurator, MessageModule, CommonModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                        <span [innerHTML]="sanitizedLogo" class="mb-4"></span>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">{{ 'LOGIN_TITLE' | translate: { appName: configService.appName } }}</div>
                            <span class="text-muted-color font-medium">{{ 'LOGIN_TITLE_2' | translate }}</span>
                        </div>
                        <!-- MENSAJE DE ERROR -->
                        <p-message *ngIf="visibleError()" severity="error" text="{{ 'EMAIL_OR_PASSWORD_ERROR' | translate }}" styleClass="block mb-4"></p-message>
                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">{{ 'EMAIL' | translate }}</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">{{ 'PASSWORD' | translate }}</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">{{ 'REMEMBER_ME' | translate }}</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">{{ 'RECOVERY_PASSWORD' | translate }}</span>
                            </div>
                            <app-spinner-button label="{{ 'BUTTON_SIGNIN' | translate }}" [loading]="isLoading" styleClass="p-button-primary w-full" (clickEvent)="onLogin()"></app-spinner-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Botón flotante para ir a '/landing' -->
        <button pButton icon="pi pi-home" pTooltip="{{ 'GO_LANDING' | translate }}" tooltipPosition="right" class="floating-btn" (click)="goToLanding()"></button>

    `,
    styles: `
        .floating-btn {
            position: fixed;
            top: 2rem;
            left: 1rem;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            z-index: 10000;
        }
    `
})
export class Login {
    sanitizedLogo: any;
    email: string = '';
    password: string = '';
    isLoading: boolean = false;
    checked: boolean = false;

    // Signal para controlar la visibilidad del mensaje de error
    visibleError = signal(false);

    constructor(
        private authService: AuthService,
        public configService: AppConfigService,
        private router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.sanitizedLogo = this.sanitizer.bypassSecurityTrustHtml(this.configService.appLogoLogin);
    }

    onLogin() {
        this.isLoading = true;
        this.authService
            .login(this.email, this.password)
            .then(() => {
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
            })
            .catch(() => {
                this.isLoading = false;
                // Mostrar el mensaje de error
                this.showError();
            });
    }

    showError() {
        this.visibleError.set(true);
        setTimeout(() => {
            this.visibleError.set(false);
        }, 3500);
    }

    goToLanding() {
        this.router.navigate(['/']);
    }
}
