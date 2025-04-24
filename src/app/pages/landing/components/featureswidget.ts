import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScroll } from 'primeng/animateonscroll';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule, AnimateOnScroll],
    template: `
        <div id="features" class="container mt-24 lg:mt-48 px-6 lg:px-20 mx-auto max-w-[73rem] flex flex-col gap-24 lg:gap-60">
            <!-- Feature 1: Reservas -->
            <div pAnimateOnScroll enterClass="animate-slidefadein" class="flex md:flex-row flex-col-reverse items-center justify-between gap-16 lg:gap-20 animate-duration-500">
                <div class="flex-1">
                    <div class="badge">Reservas</div>
                    <h3 class="text-3xl lg:text-5xl text-surface-950 dark:text-surface-0 font-semibold leading-tight mt-4">Reserva tu Vuelo con Facilidad y Seguridad</h3>
                    <p class="text-lg lg:text-xl text-surface-500 dark:text-white/64 mt-6">Utiliza nuestra plataforma SkyLink para encontrar y reservar vuelos de manera rápida, segura y personalizada.</p>
                    <ul class="flex flex-col gap-3.5 mt-8">
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Búsqueda de Vuelos en Tiempo Real</li>
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Selección de Asientos Personalizada</li>
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Pagos Seguros en Línea</li>
                    </ul>
                    <a class="cursor-pointer button-gradient mt-8">Comenzar Ahora</a>
                </div>
                <div class="w-full md:flex-1 h-[31rem] relative rounded-4xl overflow-hidden shadow-blue-card">
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(0deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.20)_100%)]"></div>
                    <img alt="SkyLink Reservas" class="object-cover -z-2 absolute w-full h-full" src="assets/img/scale-gallery-2.jpg" />
                </div>
            </div>

            <!-- Feature 2: Experiencia -->
            <div pAnimateOnScroll enterClass="animate-slidefadein" class="flex items-center justify-between gap-16 lg:gap-20 md:flex-row-reverse flex-col-reverse animate-duration-500">
                <div class="flex-1">
                    <div class="badge">Experiencia</div>
                    <h3 class="text-3xl lg:text-5xl text-surface-950 dark:text-surface-0 font-semibold leading-tight mt-4">Vive una Experiencia de Viaje Inigualable</h3>
                    <p class="text-lg lg:text-xl text-surface-500 dark:text-white/64 mt-6">Mejora tu experiencia de viaje con herramientas diseñadas para hacer que cada vuelo sea perfecto.</p>
                    <ul class="flex flex-col gap-3.5 mt-8">
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Notificaciones de Vuelo en Tiempo Real</li>
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Gestión de Equipaje Simplificada</li>
                        <li class="flex items-center gap-3 text-surface-500 dark:text-white/64 text-lg lg:text-xl"><i class="pi pi-check-circle !text-base"></i> Opciones de Personalización de Viaje</li>
                    </ul>
                    <a class="cursor-pointer button-gradient mt-8">Comenzar Ahora</a>
                </div>
                <div class="w-full md:flex-1 h-[31rem] relative rounded-4xl overflow-hidden shadow-blue-card">
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(0deg,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.20)_100%)]"></div>
                    <img alt="SkyLink Experiencia" class="object-cover -z-2 absolute w-full h-full" src="assets/img/scale-gallery-3.jpg" />
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                @keyframes slidedown-icon {
                    0% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(20px);
                    }
                    100% {
                        transform: translateY(0);
                    }
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
                .slidedown-icon {
                    animation: slidedown-icon 3s infinite;
                }
                .animate-slidefadein {
                    animation: slidefadein 500ms ease-out forwards;
                }
                .box {
                    background-image: radial-gradient(var(--primary-300), var(--primary-600));
                    border-radius: 50% !important;
                    color: var(--primary-color-text);
                }
            }
            .container {
                margin-left: auto;
                margin-right: auto;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            .rounded-4xl {
                border-radius: 2rem;
            }
            .animate-duration-500 {
                animation-duration: 500ms;
            }
            .shadow-blue-card {
                box-shadow:
                    0 10px 15px -3px rgba(0, 0, 255, 0.1),
                    0 4px 6px -2px rgba(0, 0, 255, 0.05);
            }
            .dark .shadow-blue-card {
                box-shadow: none;
            }
            .badge {
                display: block;
                width: fit-content;
                border-radius: 9999px;
                border-width: 1px;
                --tw-border-opacity: 1;
                border-color: color-mix(in srgb, var(--p-surface-200) calc(100% * var(--tw-border-opacity, 1)), transparent);
                --tw-bg-opacity: 1;
                background-color: color-mix(in srgb, var(--p-surface-0) calc(100% * var(--tw-bg-opacity, 1)), transparent);
                padding: 0.45rem 0.875rem;
                font-weight: 600;
                --tw-text-opacity: 1;
                color: color-mix(in srgb, var(--p-surface-950) calc(100% * var(--tw-text-opacity, 1)), transparent);
                --tw-shadow: 0px 1px 2px 0px rgba(18, 18, 23, 0.05);
                --tw-shadow-colored: 0px 1px 2px 0px var(--tw-shadow-color);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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
            .text-surface-950 {
                color: #1a1a1a;
            }
            .text-surface-500 {
                color: #6b7280;
            }
            .dark .text-surface-0 {
                color: #ffffff;
            }
            .dark .text-white\\/64 {
                color: rgba(255, 255, 255, 0.64);
            }
            .flex-1 {
                flex: 1 1 0%;
            }
            .gap-24 {
                gap: 6rem;
            }
            .gap-60 {
                gap: 15rem;
            }
            .mt-24 {
                margin-top: 6rem;
            }
            .mt-48 {
                margin-top: 12rem;
            }
            .px-6 {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
            }
            .px-20 {
                padding-left: 5rem;
                padding-right: 5rem;
            }
            @media (min-width: 1024px) {
                .lg\\:gap-60 {
                    gap: 15rem;
                }
                .lg\\:mt-48 {
                    margin-top: 12rem;
                }
                .lg\\:px-20 {
                    padding-left: 5rem;
                    padding-right: 5rem;
                }
                .lg\\:text-5xl {
                    font-size: 3rem;
                    line-height: 1;
                }
                .lg\\:text-xl {
                    font-size: 1.25rem;
                    line-height: 1.75rem;
                }
            }
            @media (min-width: 768px) {
                .md\\:flex-row {
                    flex-direction: row;
                }
                .md\\:flex-row-reverse {
                    flex-direction: row-reverse;
                }
                .md\\:flex-1 {
                    flex: 1 1 0%;
                }
            }
        `
    ]
})
export class FeaturesWidget {}
