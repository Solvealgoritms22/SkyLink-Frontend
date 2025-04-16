import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TopbarWidget } from './topbarwidget.component';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, CommonModule, TopbarWidget],
    template: `
        <div class="h-[50rem] lg:h-[44rem] relative animate-duration-500 animate-slidefadein">
            <!-- Background Image -->
            <img 
                src="assets/img/hero-background.jpg"
                alt="Hero Background"
                class="w-full h-full object-cover absolute inset-0 -z-10"
            />

            <!-- Gradient Overlay -->
            <div
                class="absolute inset-0 -z-5 bg-[linear-gradient(106deg,rgba(0,0,0,0.36)_0.48%,rgba(0,0,0,0.10)_100%)]"
            ></div>

            <!-- Container -->
            <div class="container mx-auto px-6">
                <div class="h-[50rem] lg:h-[44rem] relative overflow-hidden rounded-3xl lg:rounded-4xl flex flex-col">

                    <!-- Top Bar -->
                    <topbar-widget></topbar-widget>

                    <!-- Main Content -->
                    <div class="flex-1 flex flex-col justify-between pb-16">
                        <div class="mt-10 lg:mt-20 lg:ml-20 px-6 lg:px-0">
                            <h1 class="title text-4xl lg:text-7xl max-w-2xl !leading-tight">
                                Streamline Your Logistics Operations
                            </h1>
                            <p 
                                class="mt-6 description max-w-[40rem] text-[#ffffffb8] lg:text-base text-lg"
                                style="color: #ffffffb8;"
                            >
                                Optimize your supply chain with our cutting-edge logistics solutions, ensuring
                                timely and efficient delivery of your goods worldwide.
                            </p>
                            <div class="mt-8 flex items-center gap-3">
                                <a routerLink="" class="button-regular" href="/">Get Started</a>
                                <a routerLink="" class="button-outlined" href="/">Explore</a>
                            </div>
                        </div>

                        <!-- Customer Logos -->
                        <div class="mb-0 mt-auto">
                            <!-- Cinta de logos (1era repetición) -->
                            <div
                                class="w-full flex flex-nowrap gap-6 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_white_128px,_white_calc(100%-128px),transparent_100%)]"
                            >
                                <div class="flex flex-nowrap items-center animate-infinite-scroll">
                                    <div
                                        class="w-44 flex items-center flex-nowrap justify-center gap-4"
                                        *ngFor="let customer of customers"
                                    >
                                        <div class="h-10 w-10">
                                            <img
                                                [src]="customer.logo"
                                                [alt]="customer.name + ' logo'"
                                                class="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span
                                            class="font-semibold text-white/56 text-lg"
                                            style="color: #ffffff8f;"
                                        >
                                            {{ customer.name }}
                                        </span>
                                    </div>
                                </div>
                                <!-- Duplicado para el efecto de scroll infinito -->
                                <div class="flex flex-nowrap items-center animate-infinite-scroll" aria-hidden="true">
                                    <div
                                        class="w-44 flex items-center flex-nowrap justify-center gap-4"
                                        *ngFor="let customer of customers"
                                    >
                                        <div class="h-10 w-10">
                                            <img
                                                [src]="customer.logo"
                                                [alt]="customer.name + ' logo'"
                                                class="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span
                                            class="font-semibold text-white/56 text-lg"
                                            style="color: #ffffff8f;"
                                        >
                                            {{ customer.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
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
            .animate-slidefadein {
                animation: slidefadein 0.5s ease-out forwards;
            }

            @keyframes infinite-scroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-50%);
                }
            }
            .animate-infinite-scroll {
                animation: infinite-scroll 20s linear infinite;
            }

            .button-regular {
                display: flex;
                min-width: 7rem;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                border-radius: 9999px;
                --tw-bg-opacity: 1;
                background-color: color-mix(in srgb, var(--p-surface-0) calc(100% * var(--tw-bg-opacity, 1)), transparent);
                padding: 0.7rem 1.25rem;
                font-weight: 500;
                --tw-text-opacity: 1;
                color: color-mix(in srgb, var(--p-surface-950) calc(100% * var(--tw-text-opacity, 1)), transparent);
                --tw-shadow: 0px 10px 10px -8px rgba(18, 18, 23, 0.02),
                    0px 2px 2px -1.5px rgba(18, 18, 23, 0.02),
                    0px 1px 1px -0.5px rgba(18, 18, 23, 0.02),
                    0px 0px 0px 1px rgba(18, 18, 23, 0.02);
                --tw-shadow-colored: 0px 10px 10px -8px var(--tw-shadow-color),
                    0px 2px 2px -1.5px var(--tw-shadow-color),
                    0px 1px 1px -0.5px var(--tw-shadow-color),
                    0px 0px 0px 1px var(--tw-shadow-color);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                    var(--tw-ring-shadow, 0 0 #0000),
                    var(--tw-shadow);
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 0.15s;
            }
            .button-regular:hover {
                opacity: 0.8;
            }

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
                --tw-backdrop-blur: blur(16px);
                -webkit-backdrop-filter: var(--tw-backdrop-blur)
                    var(--tw-backdrop-brightness)
                    var(--tw-backdrop-contrast)
                    var(--tw-backdrop-grayscale)
                    var(--tw-backdrop-hue-rotate)
                    var(--tw-backdrop-invert)
                    var(--tw-backdrop-opacity)
                    var(--tw-backdrop-saturate)
                    var(--tw-backdrop-sepia);
                backdrop-filter: var(--tw-backdrop-blur)
                    var(--tw-backdrop-brightness)
                    var(--tw-backdrop-contrast)
                    var(--tw-backdrop-grayscale)
                    var(--tw-backdrop-hue-rotate)
                    var(--tw-backdrop-invert)
                    var(--tw-backdrop-opacity)
                    var(--tw-backdrop-saturate)
                    var(--tw-backdrop-sepia);
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 0.15s;
            }
            .button-outlined:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .container {
                margin-left: auto;
                margin-right: auto;
                max-width: 1152px;
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .title {
                background-image: linear-gradient(180deg, #ffffffd9 5%, #fff 90%);
                font-size: 3.75rem;
                line-height: 1;
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
export class HeroWidget {
    // Cambia 'logo' para que apunte al archivo SVG individual de cada cliente:
    customers = [
        { name: 'Trimzales',  logo: 'assets/logos/trimzales.svg' },
        { name: 'ZenTrailMs',  logo: 'assets/logos/zentrailms.svg' },
        { name: 'Wavelength',  logo: 'assets/logos/wavelength.svg' },
        { name: 'AlphaHex',    logo: 'assets/logos/alphahex.svg' },
        { name: 'Mistranet',   logo: 'assets/logos/mistranet.svg' }
    ];
}
