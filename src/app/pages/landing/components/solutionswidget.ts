import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'solutions-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, IconFieldModule],
    template: `
        <div id="solutions" class="container mt-64">
            <!-- Header Section -->
            <div class="max-w-[40rem] mx-auto">
                <h1 class="text-3xl lg:text-7xl font-semibold text-surface-950 dark:text-surface-0">Soluciones para Viajes Simplificados</h1>
                <p class="text-xl text-surface-500 dark:text-white/64 mt-6">Descubre las últimas tendencias y consejos prácticos para planificar tus viajes con SkyLink.</p>
                <a class="cursor-pointer button-gradient mt-6"> Todos los Blogs <i class="pi pi-arrow-right !text-sm"></i></a>
            </div>

            <!-- Grid Section -->
            <div class="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-px rounded-4xl overflow-hidden" style="border-radius: 2rem;">
                <!-- Card 1 -->
                <div class="relative h-[34rem] group animate-duration-500 animate-slidefadein">
                    <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.40)_64.82%)] group-hover:bg-[rgba(37,99,235,0.10)] transition-all" style="z-index: 1;"></div>
                    <img alt="SkyLink Flight Booking" class="select-none object-cover group-hover:grayscale transition-all absolute w-full h-full" src="assets/img/escape-hotel.jpg" />
                    <div class="absolute left-8 right-8 bottom-8 flex flex-col gap-3" style="z-index: 2;">
                        <div class="flex items-center justify-between">
                            <span class="text-4xl text-[#ffffffb8] font-semibold">01</span>
                            <p-button class="group-hover:opacity-100 opacity-0 button-regular h-8 min-w-0 px-4" [icon]="'pi pi-arrow-right'" iconPos="right" [text]="true"></p-button>
                        </div>
                        <h5 class="text-2xl title">Reservas de Vuelos Simplificadas</h5>
                        <p class="text-[#ffffffb8] text-lg">Aprende cómo reservar vuelos de forma rápida y eficiente con SkyLink.</p>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="relative h-[34rem] group animate-duration-500 animate-slidefadein">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.40)] group-hover:bg-[rgba(37,99,235,0.10)] transition-all" style="z-index: 1;"></div>
                    <img alt="SkyLink Eco Travel" class="select-none object-cover group-hover:grayscale transition-all absolute w-full h-full" src="assets/img/escape-nature.jpg" />
                    <div class="absolute left-8 right-8 bottom-8 flex flex-col gap-3" style="z-index: 2;">
                        <div class="flex items-center justify-between">
                            <span class="text-4xl text-[#ffffffb8] font-semibold">02</span>
                            <p-button class="group-hover:opacity-100 opacity-0 button-regular h-8 min-w-0 px-4" [icon]="'pi pi-arrow-right'" iconPos="right" [text]="true"></p-button>
                        </div>
                        <h5 class="text-2xl title">Viajes Sostenibles</h5>
                        <p class="text-[#ffffffb8] text-lg">Descubre prácticas ecológicas para reducir el impacto ambiental de tus viajes.</p>
                    </div>
                </div>

                <!-- Card 3 -->
                <div class="relative h-[34rem] group animate-duration-500 animate-slidefadein">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.40)] group-hover:bg-[rgba(37,99,235,0.10)] transition-all" style="z-index: 1;"></div>
                    <img alt="SkyLink Travel Tech" class="select-none object-cover group-hover:grayscale transition-all absolute w-full h-full" src="assets/img/escape-beach.jpg" />
                    <div class="absolute left-8 right-8 bottom-8 flex flex-col gap-3" style="z-index: 1;">
                        <div class="flex items-center justify-between">
                            <span class="text-4xl text-[#ffffffb8] font-semibold">03</span>
                            <p-button class="group-hover:opacity-100 opacity-0 button-regular h-8 min-w-0 px-4" [icon]="'pi pi-arrow-right'" iconPos="right" [text]="true"></p-button>
                        </div>
                        <h5 class="text-2xl title">El Futuro de la Tecnología de Viajes</h5>
                        <p class="text-[#ffffffb8] text-lg">Explora las innovaciones tecnológicas que están transformando la experiencia de viajar.</p>
                    </div>
                </div>
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
            .button-regular {
                background: transparent;
                border: none;
            }
            .title {
                color: white;
                font-weight: 600;
            }
            .animate-slidefadein {
                animation: slidefadein 0.5s ease-in-out;
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
            .button-gradient {
                display: flex;
                width: fit-content;
                min-width: 7rem;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                border-radius: 9999px;
                background-image: linear-gradient(180deg, #1e40af 0%, #3b82f6 100%);
                padding: 0.7rem 1.25rem;
                font-weight: 500;
                --tw-text-opacity: 1;
                color: color-mix(in srgb, var(--p-surface-0) calc(100% * var(--tw-text-opacity, 1)), transparent);
                --tw-shadow: var(--blue-card-shadow);
                --tw-shadow-colored: var(--blue-card-shadow);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 0.15s;
            }
            .button-gradient:hover {
                opacity: 0.8;
            }
            .title {
                background-image: linear-gradient(180deg, #ffffffd9 5%, #fff 90%);
                font-weight: 600;
                line-height: 125%;
                color: transparent;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `
    ]
})
export class SolutionsWidget {}
