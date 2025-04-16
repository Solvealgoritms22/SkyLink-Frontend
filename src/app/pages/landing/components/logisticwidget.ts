import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton'; // Importar SkeletonModule para el skeleton
import { AnimateOnScroll } from 'primeng/animateonscroll';

@Component({
    selector: 'logistic-widget',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AnimateOnScroll,
        SkeletonModule // Añadido para soportar skeleton
    ],
    template: `
        <div id="logistic" class="container relative mt-64 mx-0 my-12 lg:mx-20">
            <!-- Imagen de fondo con gradiente -->
            <div class="h-[45rem] absolute left-2 right-2 rounded-4xl shadow-md overflow-hidden">
                <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.48)_49%,rgba(0,0,0,0.10)_100%)]" style="z-index: 1"></div>
                <!-- Skeleton mientras carga la imagen -->
                <p-skeleton *ngIf="!imageLoaded" shape="rectangle" styleClass="w-full h-full"></p-skeleton>
                <img src="assets/img/services-background.jpg" alt="Logistic Services Image" class="object-cover left-0 absolute w-full h-full" [class.hidden]="!imageLoaded" (load)="onImageLoad()" (error)="onImageError()" />
            </div>

            <!-- Contenido principal -->
            <div class="pt-20">
                <!-- Título y descripción -->
                <div pAnimateOnScroll enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-1000" leaveClass="animate-leave fade-out-0" class="max-w-lg sm:mx-auto mx-10 relative" style="z-index: 3;">
                    <h1 class="text-3xl lg:text-5xl font-semibold text-surface-0">Optimize Your Supply Chain with Confidence</h1>
                    <p class="mt-6 text-[#ffffffb8] text-lg">Utilize our advanced logistics solutions to streamline your supply chain and enhance efficiency.</p>
                </div>

                <!-- Tarjetas de servicios -->
                <div class="mt-16 relative max-w-[70rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mx-auto shadow-blue-card dark:shadow-black-card dark:bg-surface-800 bg-surface-200 rounded-4xl overflow-hidden" style="z-index: 2">
                    <div *ngFor="let service of services; let i = index" class="flex flex-col p-8 bg-surface-0 dark:bg-surface-950 animate-duration-500 animate-slidefadein">
                        <div class="bg-main-gradient w-16 h-16 rounded-full flex items-center justify-center shadow-blue-card">
                            <img [src]="service.icon" alt="{{ service.title }} Icon" class="w-7 h-7" />
                        </div>
                        <h4 class="text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-6">
                            {{ service.title }}
                        </h4>
                        <p class="flex-1 text-surface-500 dark:text-white mt-4">
                            {{ service.description }}
                        </p>
                        <a [routerLink]="service.link" class="flex items-center justify-between gap-6 mt-6 cursor-pointer group">
                            <span class="flex-1 text-surface-950 dark:text-surface-0 font-medium">Read More</span>
                            <i class="pi pi-arrow-right group-hover:translate-x-4 transition-all"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Imagen inferior -->
            <div>
                <img src="assets/img/services-containers.png" alt="Logistic Services Containers Image" class="w-full h-auto max-w-[72rem] mx-auto" />
            </div>
        </div>
    `,
    styles: `
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
                max-width: 1152px;
                padding-left: 1rem;
                padding-right: 1rem;
            }
        .rounded-4xl {
            border-radius: 2rem;
        }
        .animate-duration-500 {
            animation-duration: 500ms;
        }
        .shadow-black-card {
            --tw-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px -1px 1px 0px rgba(0, 0, 0, 0.06) inset, 0px 12px 3px 0px rgba(0, 0, 0, 0), 0px 8px 3px 0px rgba(0, 0, 0, 0.01), 0px 4px 3px 0px rgba(0, 0, 0, 0.03),
                0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.06);
            --tw-shadow-colored: 0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px -1px 1px 0px rgba(0, 0, 0, 0.06) inset, 0px 12px 3px 0px rgba(0, 0, 0, 0), 0px 8px 3px 0px rgba(0, 0, 0, 0.01), 0px 4px 3px 0px rgba(0, 0, 0, 0.03),
                0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.06);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }

        .dark:shadow-black-card {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
        }

        .bg-main-gradient {
            background: linear-gradient(90deg, #3b82f6, #a855f7);
        }

        .text-surface-0 {
            color: #ffffff;
        }

        .text-surface-950 {
            color: #111827;
        }

        .text-surface-500 {
            color: #6b7280;
        }

        .dark\:text-surface-0 {
            .dark & {
                color: #ffffff;
            }
        }

        .bg-surface-0 {
            background-color: #ffffff;
        }

        .bg-surface-200 {
            background-color: #e5e7eb;
        }

        .bg-surface-800 {
            background-color: #1f2937;
        }

        .animate-duration-500 {
            animation-duration: 500ms;
        }

        .animate-slidefadein {
            animation: slidefadein 0.5s ease-out;
        }

        .shadow-blue-card {
            --tw-shadow: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07), 0px 2px 5px 0px rgba(120, 149, 206, 0.08);
            --tw-shadow-colored: 0px 59px 16px -8px rgba(120, 149, 206, 0), 0px 38px 15px -8px rgba(120, 149, 206, 0.01), 0px 21px 13px -8px rgba(120, 149, 206, 0.04), 0px 9px 9px -4px rgba(120, 149, 206, 0.07),
                0px 2px 5px 0px rgba(120, 149, 206, 0.08);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
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

        .group:hover .group-hover\:translate-x-4 {
            transform: translateX(1rem);
        }

        .transition-all {
            transition: all 0.3s ease;
        }

        .pi-arrow-right {
            font-size: 1rem;
        }
    `
})
export class LogisticWidget {
    // Lista de servicios para iterar en el template
    services = [
        {
            title: 'Ocean Freight',
            description: 'Optimize your supply chain with our reliable ocean freight services. We ensure timely and efficient delivery of your goods across the globe, with comprehensive tracking and customs clearance support.',
            icon: 'assets/icons/ship.svg',
            link: ''
        },
        {
            title: 'Land Freight',
            description: 'Enhance your logistics operations with our robust land freight solutions. We offer flexible and cost-effective transportation options for your goods, ensuring safe and timely delivery.',
            icon: 'assets/icons/deliverytruck.svg',
            link: ''
        },
        {
            title: 'Air Freight',
            description: 'Experience fast and secure air freight services with us. We provide expedited shipping solutions, handling everything from small parcels to large cargo, ensuring your goods reach their destination quickly.',
            icon: 'assets/icons/planes.svg',
            link: ''
        },
        {
            title: 'Warehousing',
            description: 'Secure and manage your inventory with our state-of-the-art warehousing solutions. Our facilities are equipped with the latest technology to ensure the safety and efficiency of your storage needs.',
            icon: 'assets/icons/warehouse.svg',
            link: ''
        },
        {
            title: 'Storage Solutions',
            description: 'Optimize your inventory management with our comprehensive storage solutions. We offer both short-term and long-term storage options, ensuring your goods are well-protected and easily accessible.',
            icon: 'assets/icons/warehouse.svg', // Reutilizando el ícono de warehouse
            link: ''
        },
        {
            title: 'Freight Forwarding',
            description: 'Simplify your logistics with our expert transport services. We handle documentation, customs clearance, and delivery to ensure a smooth, efficient process.',
            icon: 'assets/icons/parcel.svg',
            link: ''
        }
    ];

    // Propiedades para manejar la carga de imágenes
    imageLoaded = false;
    error = false;

    onImageLoad(): void {
        this.imageLoaded = true;
        this.error = false;
    }

    onImageError(): void {
        this.error = true;
        this.imageLoaded = false;
    }
}
