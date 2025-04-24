import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarComponent } from '../../../shared';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AvatarComponent, CommonModule],
    template: `
        <!-- Navbar -->
        <nav class="border-b border-dashed border-white/10 flex items-center justify-between py-6 px-6 relative z-50">
            <!-- Logo -->
            <a href="/">
                <span [innerHTML]="sanitizedLogo"></span>
            </a>
            <!-- Desktop Menu -->
            <ul class="hidden lg:flex items-center gap-3">
                <li>
                    <a (click)="router.navigate([''], { fragment: 'home' })" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Home</a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'weare' })" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">About</a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'features' })" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Features</a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'testimonial' })" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Testimonial</a>
                </li>
                <li>
                    <a (click)="router.navigate([''], { fragment: 'solutions' })" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Solutions</a>
                </li>
            </ul>

            <!-- Desktop Buttons -->
            <div class="hidden lg:flex gap-2">
                <button class="button-outlined text-xs" *ngIf="!authService.isLoggedIn" routerLink="/auth/login">
                    <i class="fa-duotone fa-solid fa-user mr-1"></i>
                    Login
                </button>
                <button class="button-outlined" *ngIf="authService.isLoggedIn" routerLink="/dashboard">
                    <app-avatar [imgUrl]="userWithImage.img" [username]="userWithImage.name" [role]="userWithImage.role" [avatarSize]="28" [textSize]="8"></app-avatar>
                </button>
                <button class="button-outlined text-xs" *ngIf="!authService.isLoggedIn" routerLink="/auth/register">
                    <i class="fa-sharp-duotone fa-solid fa-registered mr-1"></i>
                    Registrar
                </button>
            </div>
            <!-- Mobile Menu Toggle -->
            <div class="lg:hidden cursor-pointer">
                <a class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" (click)="toggleMobileMenu()">
                    <i class="pi" [ngClass]="isMobileMenuOpen ? 'pi-times' : 'pi-bars'"></i>
                </a>
            </div>
        </nav>

        <!-- Mobile Menu -->
        <div class="lg:hidden bg-black bg-opacity-30 backdrop-blur-md border-t border-dashed border-white/10 py-4 px-6 absolute right-0 rounded-md" *ngIf="isMobileMenuOpen">
            <ul class="flex flex-col gap-3">
                <li>
                    <a (click)="navigateAndClose([''], 'home')" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Home</a>
                </li>
                <li>
                    <a (click)="navigateAndClose([''], 'weare')" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">About</a>
                </li>
                <li>
                    <a (click)="navigateAndClose([''], 'features')" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Features</a>
                </li>
                <li>
                    <a (click)="navigateAndClose([''], 'testimonial')" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Testimonial</a>
                </li>
                <li>
                    <a (click)="navigateAndClose([''], 'solutions')" class="inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 pl-3 text-[#ffffffb8] hover:text-white hover:bg-white/8 transition-all">Solutions</a>
                </li>
            </ul>
            <div class="flex flex-col gap-2 mt-4">
                <button class="button-outlined text-xs" *ngIf="!authService.isLoggedIn" (click)="navigateAndClose('/auth/login')" routerLink="/auth/login">
                    <i class="fa-duotone fa-solid fa-user mr-1"></i>
                    Login
                </button>
                <button class="button-outlined" *ngIf="authService.isLoggedIn" (click)="navigateAndClose('/dashboard')" routerLink="/dashboard">
                    <app-avatar [imgUrl]="userWithImage.img" [username]="userWithImage.name" [role]="userWithImage.role" [avatarSize]="28" [textSize]="8"></app-avatar>
                </button>
                <button class="button-outlined text-xs" *ngIf="!authService.isLoggedIn" (click)="navigateAndClose('/auth/register')" routerLink="/auth/register">
                    <i class="fa-sharp-duotone fa-solid fa-registered mr-1"></i>
                    Register
                </button>
            </div>
        </div>
    `,
    styles: `
        .button-outlined {
            display: flex;
            min-width: 7rem;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            border-radius: 9999px;
            border-width: 1px;
            border-color: #ffffff3d;
            padding: 0.7rem 1.25rem;
            font-weight: 500;
            --tw-text-opacity: 1;
            color: color-mix(in srgb, var(--p-surface-0) calc(100% * var(--tw-text-opacity, 1)), transparent);
            background-color: rgba(0, 0, 0, 0.3); /* Fondo oscuro con transparencia */
            --tw-backdrop-blur: blur(16px);
            -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity)
                var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
            backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
                var(--tw-backdrop-sepia);
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 0.15s;
        }
        .button-outlined:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }
    `
})
export class TopbarWidget implements OnInit {
    sanitizedLogo: any;
    isMobileMenuOpen: boolean = false;
    userWithImage = {
        name: '',
        email: '',
        role: '',
        img: ''
    };
    constructor(
        public router: Router,
        public configService: AppConfigService,
        public authService: AuthService,
        private sanitizer: DomSanitizer
    ) {
        this.sanitizedLogo = this.sanitizer.bypassSecurityTrustHtml(this.configService.fullLogoApp);
    }

    ngOnInit() {
        // Llamamos a getUser() al iniciar
        this.authService
            .getUser()
            .then((user) => {
                // Ajusta según la estructura real que retorne tu `getUser()`.
                this.userWithImage = {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    img: user.img
                };
            })
            .catch((err) => {
                console.error('Error al obtener usuario:', err);
                // Podrías mostrar un mensaje de error o fallback
            });
    }
    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    navigateAndClose(path: string | string[], fragment?: string): void {
        this.isMobileMenuOpen = false;
        if (typeof path === 'string') {
            this.router.navigate([path]);
        } else {
            this.router.navigate(path, fragment ? { fragment } : undefined);
        }
    }
}
