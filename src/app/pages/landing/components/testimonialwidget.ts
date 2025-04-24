import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'testimonial-widget',
    standalone: true,
    imports: [CommonModule, CarouselModule, AvatarModule, SkeletonModule, ButtonModule, RippleModule],
    template: `
        <div id="testimonial" class="testimonial-container">
            <!-- Título y descripción -->
            <div class="title-section">
                <h1 class="main-title">
                    Lo que Dicen <br />
                    Nuestros Clientes Felices
                </h1>
                <p class="subtitle">
                    La satisfacción de nuestros clientes es nuestra prioridad. Escucha las experiencias de quienes han utilizado los servicios de reservación de vuelos de SkyLink. Sus comentarios nos inspiran a mejorar e innovar constantemente.
                </p>
            </div>

            <!-- Carrusel con gradientes laterales para el efecto fade -->
            <div class="carousel-wrapper">
                <!-- Gradiente en el lado izquierdo -->
                <div class="fade-left"></div>
                <!-- Gradiente en el lado derecho -->
                <div class="fade-right"></div>

                <p-carousel [value]="testimonials" [numVisible]="3" [numScroll]="1" [responsiveOptions]="responsiveOptions" [circular]="true" [autoplayInterval]="5000" [showIndicators]="false" [showNavigators]="false" class="my-carousel">
                    <ng-template pTemplate="item" let-testimonial>
                        <div class="carousel-item-wrapper">
                            <div class="testimonial-card">
                                <!-- Bloque de texto (izquierda en desktop) -->
                                <div class="testimonial-text">
                                    <!-- Ícono de comillas -->
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 43" fill="none" class="quote-icon">
                                        <path
                                            d="M4.97157 39.2933C1.73675 35.8538 0 31.9961 0 25.7428C0 14.7389 7.71645 4.87629 18.9378 0L21.7424 4.33238C11.2685 10.0041 9.2208 17.3641 8.40424 22.0046C10.0907 21.1306 12.2986 20.8256 14.4625 21.0268C20.1281 21.5519 24.594 26.2081 24.594 31.9961C24.594 34.9145 23.4359 37.7134 21.3745 39.777C19.3131 41.8407 16.5172 43 13.6019 43C10.2321 43 7.00982 41.4595 4.97157 39.2933ZM36.3775 39.2933C33.1427 35.8538 31.406 31.9961 31.406 25.7428C31.406 14.7389 39.1224 4.87629 50.3438 0L53.1483 4.33238C42.6744 10.0041 40.6268 17.3641 39.8102 22.0046C41.4967 21.1306 43.7046 20.8256 45.8684 21.0268C51.5341 21.5519 56 26.2081 56 31.9961C56 34.9145 54.8419 37.7134 52.7805 39.777C50.7191 41.8407 47.9232 43 45.0079 43C41.638 43 38.4158 41.4595 36.3775 39.2933Z"
                                        ></path>
                                    </svg>

                                    <!-- Título y descripción del testimonio -->
                                    <h5>{{ testimonial.title }}</h5>
                                    <p>{{ testimonial.description }}</p>

                                    <!-- Datos del autor -->
                                    <div class="author-info">
                                        <div class="avatar">
                                            <p-skeleton *ngIf="!testimonial.avatarLoaded" shape="circle" styleClass="w-full h-full"></p-skeleton>
                                            <img [src]="testimonial.avatar" [alt]="testimonial.author" [class.hidden]="!testimonial.avatarLoaded" (load)="onAvatarLoad(testimonial)" />
                                        </div>
                                        <div>
                                            <div class="author-name">
                                                {{ testimonial.author }}
                                            </div>
                                            <div class="author-role">
                                                {{ testimonial.role }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Imagen (derecha en desktop) -->
                                <div class="testimonial-image-wrapper">
                                    <p-skeleton *ngIf="!testimonial.imageLoaded" styleClass="w-full h-full"></p-skeleton>
                                    <img [src]="testimonial.image" [alt]="testimonial.title" [class.hidden]="!testimonial.imageLoaded" (load)="onImageLoad(testimonial)" (error)="onImageError(testimonial)" />
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-carousel>

                <!-- Botones de navegación si los quieres mostrar en pantalla -->
                <div class="carousel-nav">
                    <button pButton type="button" icon="pi pi-arrow-left" class="carousel-btn"></button>
                    <button pButton type="button" icon="pi pi-arrow-right" class="carousel-btn"></button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            /* ----- CONTENEDOR GENERAL ----- */
            .testimonial-container {
                width: 100%;
                max-width: 1200px;
                margin: 8rem auto;
                text-align: center;
                padding: 0 1rem;
            }

            .title-section {
                max-width: 40rem;
                margin: 0 auto;
            }
            .main-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1a202c;
                line-height: 1.2;
                margin: 0;
            }
            @media (min-width: 1024px) {
                .main-title {
                    font-size: 4rem;
                }
            }
            .subtitle {
                font-size: 1rem;
                color: #6b7280;
                margin-top: 1.5rem;
                margin-bottom: 0;
            }

            /* ----- CARRUSEL & FADES LATERALES ----- */
            .carousel-wrapper {
                margin-top: 4rem;
                position: relative;
            }
            .fade-left,
            .fade-right {
                position: absolute;
                top: 0;
                bottom: 0;
                width: 15%;
                z-index: 10;
                pointer-events: none;
            }
            .fade-left {
                left: 0;
                background: linear-gradient(to right, #fff 0%, transparent 100%);
            }
            .fade-right {
                right: 0;
                background: linear-gradient(to left, #fff 0%, transparent 100%);
            }

            /* ----- Ajustamos las tarjetas en el carrusel ----- */
            .my-carousel .p-carousel-content {
                padding: 2rem 0;
            }
            /* Asignamos ancho y alto fijo a cada ítem */
            .my-carousel .p-carousel-item {
                width: 440px; /* <--- Ajusta el ancho deseado */
                height: 300px; /* <--- Ajusta la altura deseada */
                flex-shrink: 0; /* Evita que se encoja */
                display: flex;
                align-items: center;
                justify-content: center;
                transform: scale(0.85);
                opacity: 0.6;
                transition:
                    transform 0.3s ease,
                    opacity 0.3s ease;
            }
            .my-carousel .p-carousel-item-active {
                transform: scale(1);
                opacity: 1;
            }

            /* ----- BOTONES DE NAVEGACIÓN (opcionales) ----- */
            .carousel-nav {
                margin-top: 2rem;
                display: flex;
                justify-content: center;
                gap: 1rem;
            }
            .carousel-btn {
                width: 3rem !important;
                height: 3rem !important;
                border-radius: 50% !important;
                background: #fff !important;
                border: 1px solid #e2e8f0 !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                color: #4a5568 !important;
                transition: all 0.3s ease !important;
            }

            /* ----- TARJETA DE TESTIMONIO ----- */
            .carousel-item-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: stretch;
                justify-content: center;
                padding: 10px;
            }

            .testimonial-card {
                /* Forzamos el mismo tamaño en cada tarjeta */
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column; /* Texto arriba, imagen abajo en móvil */
                border-radius: 1rem;
                background: #fff;
                border: 1px solid #e5e7eb;
                box-shadow:
                    0 4px 6px -1px rgba(59, 130, 246, 0.1),
                    0 2px 4px -1px rgba(59, 130, 246, 0.06);
                overflow: hidden;
                text-align: left;
            }

            /* A partir de 1024px, imagen a la derecha, texto a la izquierda */
            @media (min-width: 1024px) {
                .testimonial-card {
                    flex-direction: row;
                }
            }

            /* Bloque de texto */
            .testimonial-text {
                flex: 1;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: start;
                gap: 0.5rem;
                overflow: hidden; /* Evita que se expanda */
            }
            .quote-icon {
                width: 1.5rem;
                fill: #a0aec0;
                margin-bottom: 0.5rem;
                flex-shrink: 0;
            }
            .testimonial-text h5 {
                font-size: 1.125rem;
                font-weight: 600;
                color: #1a202c;
                margin: 0;
                flex-shrink: 0;
            }
            /* Truncado multiline en la descripción */
            .testimonial-text .description {
                display: -webkit-box;
                -webkit-line-clamp: 4; /* <--- Número de líneas máximas */
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.875rem;
                color: #4a5568;
                line-height: 1.4;
                margin: 0;
                flex-shrink: 1;
            }

            .author-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-top: auto; /* Empujar al final del contenedor */
                flex-shrink: 0;
            }
            .avatar {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
            }
            .author-name {
                font-weight: 600;
                color: #1a202c;
                font-size: 0.875rem;
                margin-bottom: 2px;
            }
            .author-role {
                font-size: 0.75rem;
                color: #4a5568;
            }

            /* Imagen derecha en desktop */
            .testimonial-image-wrapper {
                width: 100%;
                height: 150px; /* <--- Ajusta para que no rebase la tarjeta */
                position: relative;
                flex-shrink: 0;
                overflow: hidden;
            }
            @media (min-width: 1024px) {
                .testimonial-image-wrapper {
                    width: 40%;
                    height: 100%;
                }
            }
            .testimonial-image-wrapper img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .hidden {
                display: none;
            }
        `
    ]
})
export class TestimonialWidget {
    testimonials = [
        {
            title: 'Tecnología Innovadora para Reservas',
            description: 'La tecnología de SkyLink ha simplificado nuestras reservas de vuelos. La búsqueda en tiempo real y la selección de asientos personalizada han marcado una gran diferencia para nosotros.',
            author: 'Ana Martínez',
            role: 'Coordinadora de Viajes',
            avatar: 'assets/avatars/female-9.jpg',
            image: 'assets/img/grid-norway.jpg',
            imageLoaded: false,
            avatarLoaded: false,
            error: false
        },
        {
            title: 'Reservas Rápidas y Confiables',
            description: 'Usar SkyLink ha mejorado enormemente nuestra planificación de viajes. Las notificaciones en tiempo real y la gestión sencilla de reservas han transformado nuestra experiencia.',
            author: 'Laura Gómez',
            role: 'Directora Ejecutiva',
            avatar: 'assets/avatars/female-8.jpg',
            image: 'assets/img/grid-tokyo.jpg',
            imageLoaded: false,
            avatarLoaded: false,
            error: false
        },
        {
            title: 'Atención al Cliente Excepcional',
            description: 'El soporte de SkyLink es increíble. El equipo resolvió todas nuestras dudas sobre reservas y cambios de vuelos con una eficiencia impresionante.',
            author: 'Carlos Ruiz',
            role: 'Gerente de Operaciones',
            avatar: 'assets/avatars/male-1.jpg',
            image: 'assets/img/grid-newyork.jpg',
            imageLoaded: false,
            avatarLoaded: false,
            error: false
        },
        {
            title: 'Gestión de Viajes sin Complicaciones',
            description: 'Las soluciones de SkyLink han optimizado toda nuestra planificación de viajes, desde la búsqueda de vuelos hasta la confirmación de reservas.',
            author: 'Ana Martínez',
            role: 'Coordinadora de Viajes',
            avatar: 'assets/avatars/female-9.jpg',
            image: 'assets/img/grid-rome.jpg',
            imageLoaded: false,
            avatarLoaded: false,
            error: false
        }
    ];

    /* Ajusta el número de items visibles según el ancho */
    responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '768px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    onImageLoad(testimonial: any): void {
        testimonial.imageLoaded = true;
        testimonial.error = false;
    }

    onAvatarLoad(testimonial: any): void {
        testimonial.avatarLoaded = true;
    }

    onImageError(testimonial: any): void {
        testimonial.error = true;
        testimonial.imageLoaded = false;
    }
}
