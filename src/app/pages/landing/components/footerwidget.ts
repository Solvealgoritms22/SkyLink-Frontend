import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppConfigService } from '../../../core/services/app-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'footer-widget',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
        <div class="mt-64">
            <div class="animate-duration-500 animate-slidefadein">
                <footer class="container mx-auto px-5 pt-5 lg:pt-[5.5rem] pb-10 rounded-3xl lg:rounded-4xl overflow-hidden relative shadow-none">
                    <!-- Background Image -->
                    <img alt="Footer Image" class="object-cover absolute w-full h-full top-0 bottom-0 left-0 right-0" src="assets/footer/escape-gallery-bg.jpg" style="z-index: 1;" />

                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.56)] via-[rgba(0,0,0,0.56)] to-[rgba(0,0,0,0.00)]" style="z-index: 2;"></div>

                    <!-- Circle Pattern -->
                    <div class="absolute -bottom-12 opacity-50 translate-y-1/2 w-[50rem] lg:w-[80rem] -translate-x-1/2 left-1/2 pointer-events-none" style="z-index: 3;">
                        <div class="flex items-center justify-center rounded-full border border-white/0 w-full aspect-square bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.00)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]">
                            <div
                                class="flex items-center justify-center rounded-full border border-white/0 w-[85%] aspect-square bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.00)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]"
                            >
                                <div class="flex items-center justify-center rounded-full w-[80%] aspect-square bg-gradient-to-b from-[rgba(255,255,255,0.09)] to-[rgba(255,255,255,0.00)] shadow-[0px_-18px_58px_0px_rgba(0,0,0,0.06)]"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="max-w-[64rem] mx-auto flex flex-col lg:flex-row" style="z-index: 4; position: relative;">
                        <!-- Logo and Social (Desktop) -->
                        <div class="flex-1 flex flex-col justify-between gap-4 py-4 lg:px-0 px-4">
                            <a routerLink="/" class="flex items-center">
                                <span [innerHTML]="sanitizedLogo"></span>
                            </a>
                            <div class="hidden lg:flex items-center gap-2">
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    class="h-8 px-4 cursor-pointer flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-[#ffffff1f] bg-[#ffffff0a] hover:bg-[#ffffff1f] transition-all"
                                >
                                    <i class="pi pi-youtube !text-sm"></i>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    class="h-8 px-4 cursor-pointer flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-[#ffffff1f] bg-[#ffffff0a] hover:bg-[#ffffff1f] transition-all"
                                >
                                    <i class="pi pi-twitter !text-sm"></i>
                                </a>
                                <a
                                    href="https://discord.com"
                                    target="_blank"
                                    class="h-8 px-4 cursor-pointer flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-[#ffffff1f] bg-[#ffffff0a] hover:bg-[#ffffff1f] transition-all"
                                >
                                    <i class="pi pi-discord !text-sm"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Links Columns -->
                        <div class="flex flex-wrap items-start justify-between gap-y-7">
                            <!-- SkyLink Servicios -->
                            <div class="p-2 flex flex-col gap-2">
                                <div class="px-3 py-2 text-surface-0 text-xl font-medium">Servicios SkyLink</div>
                                <div class="flex flex-col gap-2">
                                    <a routerLink="/" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Reservas de Vuelos</a>
                                    <a routerLink="/travel-packages" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Paquetes de Viaje</a>
                                    <a routerLink="/seat-selection" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Selección de Asientos</a>
                                    <a routerLink="/flight-status" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Estado de Vuelos</a>
                                    <a routerLink="/travel-insurance" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Seguro de Viaje</a>
                                    <a routerLink="/check-in" class="px-3 py-2 wininv-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Check-In en Línea</a>
                                </div>
                            </div>

                            <!-- Páginas Informativas -->
                            <div class="p-2 flex flex-col gap-2">
                                <div class="px-3 py-2 text-surface-0 text-xl font-medium">Páginas Informativas</div>
                                <div class="flex flex-col gap-2">
                                    <a routerLink="/about" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Sobre Nosotros</a>
                                    <a routerLink="/promotions" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Promociones</a>
                                    <!--<a routerLink="/blog" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Blog de Viajes</a>-->
                                    <a routerLink="/blog/detail" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Artículos de Viaje</a>
                                    <a routerLink="/contact" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Contacto</a>
                                </div>
                            </div>

                            <!-- Cuenta de Usuario -->
                            <div class="p-2 flex flex-col gap-2">
                                <div class="px-3 py-2 text-surface-0 text-xl font-medium">Cuenta de Usuario</div>
                                <div class="flex flex-col gap-2">
                                    <a routerLink="/signup" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Crear Cuenta</a>
                                    <a routerLink="/signin" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Iniciar Sesión</a>
                                    <a routerLink="/reset-password" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Recuperar Contraseña</a>
                                    <a routerLink="/account" class="px-3 py-2 w-fit text-[#ffffffb8] hover:text-white hover:bg-white/10 rounded-full transition-all">Mi Cuenta</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media (Mobile) -->
                    <div class="lg:hidden flex items-center justify-center gap-2 mt-52">
                        <a href="https://youtube.com" target="_blank" class="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full text-surface-0 backdrop-blur-sm border border-white/12 bg-white/4 hover:bg-white/12 transition-all">
                            <i class="pi pi-youtube text-sm"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" class="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full text-surface-0 backdrop-blur-sm border border-white/12 bg-white/4 hover:bg-white/12 transition-all">
                            <i class="pi pi-twitter text-sm"></i>
                        </a>
                        <a href="https://discord.com" target="_blank" class="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full text-surface-0 backdrop-blur-sm border border-white/12 bg-white/4 hover:bg-white/12 transition-all">
                            <i class="pi pi-discord text-sm"></i>
                        </a>
                    </div>

                    <!-- Copyright -->
                    <div class="w-full lg:w-[calc(100%-5rem)] mt-8 lg:mt-32 pt-10 flex items-center justify-center text-surface-0 border-t border-dashed border-[#ffffff1a] font-bold" style="z-index: 4; position: relative;">© {{ currentYear }} SkyLink</div>
                </footer>
            </div>
        </div>
    `,
    styles: [
        `
            .container {
                margin-left: auto;
                margin-right: auto;
                max-width: 1152px;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            .animate-duration-500 {
                animation-duration: 500ms;
            }
            .animate-slidefadein {
                animation: slidefadein 0.5s ease-out;
            }
            @keyframes slidefadein {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `
    ]
})
export class FooterWidget {
    sanitizedLogo: any;
    currentYear: number = new Date().getFullYear();

    constructor(
        public router: Router,
        public configService: AppConfigService,
        private sanitizer: DomSanitizer
    ) {
        this.sanitizedLogo = this.sanitizer.bypassSecurityTrustHtml(this.configService.fullLogoApp);
    }
}
