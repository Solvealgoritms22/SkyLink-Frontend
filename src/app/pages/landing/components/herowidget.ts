import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DatePickerModule } from 'primeng/datepicker'; // For p-datepicker
import { TopbarWidget } from './topbarwidget.component';
import { FlightService, Flight } from '../../service/flight.service';
import { FlightTicketComponent } from './flight-ticket';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, RippleModule, DatePickerModule, TopbarWidget, FlightTicketComponent, PaginatorModule, AnimateOnScroll],
    template: `
        <div class="relative h-[53rem] overflow-hidden">
            <!-- Background Image -->
            <img src="assets/travel/travel-hero-bg.jpg" alt="Travel Hero Background" class="absolute inset-0 w-full h-full object-cover z-10" />

            <!-- Gradient Overlays -->
            <div class="absolute inset-0 z-10 opacity-75 bg-[linear-gradient(180deg,rgba(0,0,0,0.50)_49.65%,rgba(0,0,0,0.00)_100%)]"></div>
            <div
                class="absolute lg:opacity-100 opacity-50 z-[60] bottom-0 inset-x-0 h-[22rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.00)_0%,#FFF_62.59%,#FFF_100%)] dark:bg-[linear-gradient(180deg,rgba(9,9,11,0.00)_0%,rgba(9,9,11,0.8)_62.59%,rgba(9,9,11,1)_100%)] lg:backdrop-blur-[0.75px]"
            ></div>

            <!-- Cloud and Airplane Images -->
            <div class="absolute inset-0 overflow-y-clip container">
                <img src="assets/travel/cloud-1.png" alt="Cloud 1" class="z-20 min-w-[520px] w-full h-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
                <img src="assets/travel/cloud-2.png" alt="Cloud 2" class="z-20 w-[392px] min-w-[520px] h-auto absolute -top-24 -left-60 animate-cloud-idle animation-delay-2000" />
                <img src="assets/travel/cloud-3.png" alt="Cloud 3" class="z-20 w-[760px] min-w-[520px] h-auto absolute bottom-80 -right-96 animate-cloud-idle" />
                <img src="assets/travel/cloud-4.png" alt="Cloud 4" class="z-20 w-[1272px] min-w-[520px] h-auto absolute bottom-0 lg:-bottom-52 -left-20 animate-cloud-idle animation-delay-1200" />
                <img src="assets/travel/airplane.png" alt="Airplane" class="z-50 w-[1272px] min-w-[600px] h-auto absolute bottom-40 lg:bottom-24 left-0 lg:left-20 rotate-[10deg]" />
                <img src="assets/travel/cloud-5.png" alt="Cloud 5" class="z-40 w-[1512px] min-w-[520px] h-auto absolute top-0 lg:top-24 -left-[782px] animate-cloud-idle animation-delay-1200" />
                <img src="assets/travel/cloud-5.png" alt="Cloud 5" class="z-[60] w-[1512px] min-w-[520px] h-auto absolute top-[460px] lg:top-60 left-[-200px] lg:-left-[400px] animate-cloud-idle animation-delay-2000" />
                <img src="assets/travel/cloud-5.png" alt="Cloud 5" class="z-[60] w-[1512px] min-w-[520px] h-auto absolute top-[480px] lg:top-40 left-[80px] lg:left-[160px] animate-cloud-idle animation-delay-200" />
            </div>

            <!-- Container -->
            <div class="container">
                <div class="relative rounded-b-md rounded-t-3xl lg:rounded-t-4xl h-[53rem]">
                    <!-- Top Bar -->
                    <topbar-widget></topbar-widget>

                    <!-- Title -->
                    <div class="absolute left-1/2 -translate-x-1/2 top-60 z-30 flex flex-col items-center">
                        <div class="title text-center text-3xl lg:text-4xl bg-[linear-gradient(180deg,rgba(255,255,255,0.80)_4.92%,rgba(255,255,255,0.40)_89.39%)] leading-none mb-1">La pasión por viajar te espera</div>
                        <div class="title bg-[linear-gradient(180deg,#FFF_-16.99%,rgba(255,255,255,0.00)_100%)] text-8xl lg:text-[16rem] leading-none lg:-mt-14">Skylink</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Destination Selector -->
        <div
            class="-mt-12 items-center justify-center bg-surface-0 dark:bg-surface-950 max-w-[68rem] w-[92%] lg:w-auto mx-auto shadow-blue-card dark:shadow-none border-0 dark:border border-white/10 rounded-xl lg:rounded-full p-6 lg:p-10 flex flex-col lg:flex-row gap-4 relative z-[60]"
        >
            <div class="lg:flex-1 lg:max-w-60">
                <button class="w-full flex items-center gap-2 px-4 py-3 rounded-full transition-all dark:border hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm dark:shadow-none border !border-white/12">
                    <span class="w-[7rem] truncate">Italy, Roma</span>
                    <i class="pi pi-map-marker ml-auto"></i>
                </button>
            </div>
            <div class="lg:flex-1 lg:max-w-60">
                <button class="w-full flex items-center gap-2 px-4 py-3 rounded-full transition-all dark:border hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm dark:shadow-none border !border-white/12">
                    <span class="w-[7rem] truncate">1 Room, 2 Guests</span>
                    <i class="pi pi-map-marker"></i>
                </button>
            </div>
            <p-datepicker
                placeholder="Fecha de partida"
                showIcon="true"
                iconDisplay="input"
                styleClass="lg:flex-1 !w-full"
                appendTo="body"
                inputStyleClass="!rounded-full !px-4 !py-3 !transition-all hover:bg-gray-100 dark:hover:bg-gray-800 !shadow-sm dark:!shadow-none !border-white/12 !text-inherit placeholder:!text-inherit"
            ></p-datepicker>
            <p-datepicker
                placeholder="Fecha de regreso"
                showIcon="true"
                iconDisplay="input"
                styleClass="lg:flex-1 !w-full"
                appendTo="body"
                inputStyleClass="!rounded-full !px-4 !py-3 !transition-all hover:bg-gray-100 dark:hover:bg-gray-800 !shadow-sm dark:!shadow-none !border-white/12 !text-inherit placeholder:!text-inherit"
            ></p-datepicker>
            <button class="button-gradient w-full lg:w-auto"><i class="pi pi-search"></i> Buscar...</button>
        </div>

        <!-- Botón Ver vuelos -->
        <div class="w-full flex justify-center mt-4 p-4">
            <button class="w-48 flex justify-center items-center gap-4 flex-col text-slate-500 bg-transparent font-medium" (click)="toggleFlights()">
                Ver vuelos
                <i class="fa-solid fa-beat-fade fa-xl text-slate-500" [ngClass]="{ 'fa-chevron-down': !showFlights, 'fa-chevron-up': showFlights }"></i>
            </button>
        </div>

        <!-- Listado de vuelos -->
        <div *ngIf="showFlights" class="container mt-8 flex flex-col gap-6">
            <div #scrollArea class="grid gap-8 animate-duration-1000 justify-center items-center grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                <flight-ticket *ngFor="let flight of pagedFlights" [flight]="flight" class="pt-[20px] pb-[20px]" pAnimateOnScroll [root]="scrollArea" [threshold]="0.1" enterClass="animate-slidefadein" leaveClass="animate-slidefadein" />
                <!-- placeholders del mismo tamaño -->
                <div #scrollArea2 *ngFor="let _ of placeholders" class="grid justify-center pt-[20px] pb-[20px]">
                    <div pAnimateOnScroll [root]="scrollArea2" [threshold]="0.1" enterClass="animate-slidefadein" leaveClass="animate-slidefadein" class="placeholder border-dashed border-2 flex items-center justify-center font-semibold flex-col">
                        <i class="fa-duotone fa-solid fa-ticket-airline fa-2xl-custom opacity-[0.2]"></i>
                        <div class="flex justify-center items-center gap-2">
                            <!--<i class="fa-light fa-ban fa-xl"></i>-->
                            <!--<span class="">No disponible</span>-->
                        </div>
                    </div>
                </div>
            </div>
            <!-- Paginador PrimeNG -->
            <p-paginator *ngIf="total > rows" [rows]="rows" [totalRecords]="total" styleClass="justify-center" (onPageChange)="updatePage($event)"></p-paginator>
        </div>

        <!-- Customer Logos -->
        <div class="container w-full flex flex-nowrap gap-6 overflow-hidden mt-24 pb-24 [mask-image:_linear-gradient(to_right,transparent_0,_white_128px,_white_calc(100%-128px),transparent_100%)]">
            <div class="flex flex-nowrap items-center animate-infinite-scroll">
                <div class="w-44 flex items-center flex-nowrap justify-center gap-4" *ngFor="let customer of customers">
                    <div class="h-28 w-28 fill-surface-500 dark:fill-white/50 object-cover">
                        <img [src]="customer.logo" [alt]="customer.name + ' logo'" class="w-full h-full object-contain fill-surface-500" />
                    </div>
                    <span class="font-semibold text-lg text-gray-500 dark:text-white/64">
                        {{ customer.name }}
                    </span>
                </div>
            </div>
            <div class="flex flex-nowrap items-center animate-infinite-scroll" aria-hidden="true">
                <div class="w-44 flex items-center flex-nowrap justify-center gap-4" *ngFor="let customer of customers">
                    <div class="h-28 w-28 fill-surface-500 dark:fill-white/50 object-cover">
                        <img [src]="customer.logo" [alt]="customer.name + ' logo'" class="w-full h-full object-contain fill-surface-500" />
                    </div>
                    <span class="font-semibold text-lg text-gray-500 dark:text-white/64">
                        {{ customer.name }}
                    </span>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
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

            @keyframes cloud-idle {
                0% {
                    transform: translateX(0);
                }
                50% {
                    transform: translateX(20px);
                }
                100% {
                    transform: translateX(0);
                }
            }
            .animate-cloud-idle {
                animation: cloud-idle 10s ease-in-out infinite;
            }

            .animation-delay-200 {
                animation-delay: 0.2s;
            }
            .animation-delay-1200 {
                animation-delay: 1.2s;
            }
            .animation-delay-2000 {
                animation-delay: 2s;
            }

            .button-gradient {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                border-radius: 9999px;
                background: linear-gradient(180deg, #1e40af 0%, #3b82f6 100%);
                padding: 0.7rem 1.25rem;
                font-weight: 500;
                --tw-text-opacity: 1;
                color: color-mix(in srgb, var(--p-surface-0) calc(100% * var(--tw-text-opacity, 1)), transparent);
                --tw-shadow: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07), 0px 2px 5px 0px rgba(120, 149, 206, 0.08);
                --tw-shadow-colored: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07),
                    0px 2px 5px 0px rgba(120, 149, 206, 0.08);
                box-shadow: var(0 0 #0000, 0 0 #0000), var(0 0 #0000 0 0 #0000), var(--tw-shadow);
                transition-property: all;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 0.15s;
            }
            .button-gradient:hover {
                opacity: 0.8;
            }

            .container {
                margin-left: auto;
                margin-right: auto;
                max-width: 1152px;
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .title {
                font-weight: 600;
                line-height: 125%;
                color: transparent;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .shadow-blue-card {
                --tw-shadow: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07), 0px 2px 5px 0px rgba(120, 149, 206, 0.08);
                --tw-shadow-colored: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07),
                    0px 2px 5px 0px rgba(120, 149, 206, 0.08);
                box-shadow: var(--tw-shadow);
            }
            .p-paginator .p-paginator-pages button {
                @apply rounded-full text-sm mx-1 w-9 h-9;
            }
            .ticket {
                position: relative;
                width: 20rem;
                border-radius: 2rem;
                background: #fff;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                font-family: 'Montserrat', sans-serif;
                --brand: #1e40af;
                flex-direction: column;
                height: 30rem;
                display: flex;
            }
            .ticket2 {
                justify-content: center;
                align-items: center;
                position: relative;
                width: 20rem;
                background: transparent;
                overflow: visible;
                height: 30rem;
                display: flex;
                cursor: pointer;
            }
            /* mismo tamaño que .ticket */
            .placeholder {
                width: 20rem; /* coincide con .ticket */
                min-height: 30rem; /* coincide con .ticket */
                border-radius: 2rem; /* igual radio */
                background: #f5f5f5; /* gris neutro */
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                min-width: 20rem;
                color: #9b9b9b;
                border-color: #cdcdcd;
                font-style: italic;
            }
            .dark .placeholder {
                background: gray;
            }
            /* Animación de entrada (scroll hacia abajo) */
            .animate-slidefadein {
                animation: slideFadeIn 0.6s ease-out forwards;
            }

            /* Animación de salida (scroll hacia arriba) */
            .animate-slidefadeout {
                animation: slideFadeOut 0.6s ease-in forwards;
            }

            /* Keyframes para la animación de entrada */
            @keyframes slideFadeIn {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            /* Keyframes para la animación de salida */
            @keyframes slideFadeOut {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
            }
            .fa-2xl-custom {
                font-size: 11em;
                line-height: 0.03125em;
                vertical-align: -0.1875em;
            }
        `
    ]
})
export class HeroWidget {
    customers = [
        { name: '', logo: 'assets/logos/Logo_web_Arajet.png' },
        { name: '', logo: 'assets/logos/skyhighdominicana-logo.png' },
        { name: '', logo: 'assets/logos/logotipo-aircentury.png' },
        { name: '', logo: 'assets/logos/logo-red-air.png' },
        { name: '', logo: 'assets/logos/americanairlines.jpg' }
    ];

    flights: Flight[] = [];
    showFlights = false;
    pagedFlights: Flight[] = [];
    placeholders: number[] = [];

    constructor(private flightSvc: FlightService) {}

    rows = 3; // tarjetas por página
    total = 0;

    toggleFlights() {
        this.showFlights = !this.showFlights;
        if (this.showFlights && this.flights.length === 0) {
            this.flightSvc.getFlights().subscribe((f) => {
                this.flights = f;
                this.total = f.length;
                this.updatePage({ page: 0, rows: this.rows }); // inicial
            });
        }
    }

    updatePage(event: { page?: number; rows?: number }) {
        const page = event.page ?? 0;
        const rows = event.rows ?? this.rows;

        const start = page * rows;
        const end = start + rows;
        this.pagedFlights = this.flights.slice(start, end);

        // calcula cuántos huecos hay
        const empty = rows - this.pagedFlights.length;
        this.placeholders = Array(Math.max(0, empty)).fill(0);
    }
}
