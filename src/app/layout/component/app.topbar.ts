import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../../core/services/layout.service';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../core/services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppConfigService } from '../../core/services/app-config.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, TieredMenuModule, DialogModule, ButtonModule],
    template: `
        <div class="layout-topbar shadow-md">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <span [innerHTML]="sanitizedLogo"></span>
                    <span>{{ configService.appName }}</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-calendar"></i>
                            <span>Calendar</span>
                        </button>
                        <button type="button" class="layout-topbar-action">
                            <i class="pi pi-inbox"></i>
                            <span>Messages</span>
                        </button>
                        <button (click)="menu.toggle($event)" type="button" class="layout-topbar-action">
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <p-tieredmenu #menu [model]="items" [popup]="true" />
                    </div>
                </div>
            </div>
        </div>
        <!-- Dialog de confirmación para logout -->
        <p-dialog header="Confirm Logout" [(visible)]="displayLogoutConfirm" modal="true" [closable]="false" maskStyleClass="backdrop-blur-sm">
            <p>Are you sure you want to log out?</p>
            <div class="button-container">
                <button pButton label="Cancel" class="p-button-text cancel-button" (click)="displayLogoutConfirm = false"></button>
                <button pButton label="Confirm" class="p-button-danger confirm-button" (click)="confirmLogout()"></button>
            </div>
        </p-dialog>
    `,
    styles: [
        `
            /* Agregamos separación entre los botones */
            .button-container {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1rem;
            }

            /* Aseguramos que el botón Cancel tenga margen a la derecha (si se prefiere, se usa gap en el contenedor) */
            .cancel-button {
                /* margen opcional si no se usa gap */
            }

            /* Sobrescribir el color del label del botón Confirm para que siempre sea blanco */
            :host ::ng-deep .confirm-button .p-button-label {
                color: #fff !important;
            }
        `
    ]
})
export class AppTopbar implements OnInit {
    sanitizedLogo: any;
    items: MenuItem[] | undefined;
    displayLogoutConfirm: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        public configService: AppConfigService,
        private sanitizer: DomSanitizer
    ) {
        this.sanitizedLogo = this.sanitizer.bypassSecurityTrustHtml(this.configService.appLogoSvg);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngOnInit() {
        this.items = [
            { label: 'Profile', icon: 'fa-duotone fa-solid fa-user' },
            { label: 'Setting', icon: 'fa-duotone fa-solid fa-gear' },
            { label: 'Activity', icon: 'fa-duotone fa-regular fa-wave-pulse' },
            { separator: true },
            {
                label: 'Logout',
                icon: 'fa-duotone fa-solid fa-arrow-right-from-bracket',
                command: () => this.showLogoutConfirm()
            }
        ];
    }

    showLogoutConfirm() {
        this.displayLogoutConfirm = true;
    }

    confirmLogout() {
        this.displayLogoutConfirm = false;
        this.authService.logout();
    }
}
