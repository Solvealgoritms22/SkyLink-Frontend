import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScroll } from 'primeng/animateonscroll';

@Component({
    selector: 'weare-widget',
    standalone: true,
    imports: [CommonModule, AnimateOnScroll],
    template: `
        <div id="weare" class="container mt-24 lg:mt-48 px-6 lg:px-20 mx-auto">
            <!-- Who We Are Section -->
            <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-28">
                <!-- Text Content -->
                <div class="flex-1">
                    <h2 class="text-3xl lg:text-7xl font-semibold text-surface-950 dark:text-surface-0 [text-shadow:var(--black-card-shadow)]">Quiénes Somos</h2>
                    <p class="mt-8 text-lg text-surface-500 dark:text-white/64">
                        Con más de 15 años de experiencia en la industria de viajes, en SkyLink ofrecemos soluciones de reservación de vuelos que garantizan comodidad, seguridad y confianza. Nuestra misión es facilitar tus viajes con tecnología
                        innovadora y un servicio al cliente excepcional.
                    </p>
                    <div class="mt-16">
                        <h6 class="text-2xl font-semibold text-surface-950 dark:text-surface-0 [text-shadow:var(--black-card-shadow)]">Nuestra Misión</h6>
                        <p class="mt-6 text-lg text-surface-500 dark:text-white/64">
                            Nos esforzamos por ofrecer una experiencia de reservación de vuelos eficiente, confiable y personalizada, innovando constantemente para satisfacer las necesidades de nuestros usuarios mientras promovemos la sostenibilidad
                            y la excelencia.
                        </p>
                    </div>
                </div>
                <!-- Image -->
                <div pAnimateOnScroll enterClass="animate-enter fade-in-10 zoom-in-50 animate-duration-1000" class="relative w-full max-w-[35rem] h-[31rem] overflow-hidden">
                    <img src="assets/img/travel-Photoroom.png" alt="SkyLink Quiénes Somos" class="object-contain w-full h-full" />
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Card 1 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="SkyLink Experiencia" class="object-cover -z-2 absolute w-full h-full" src="assets/img/scale-gallery-5.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">15+</h3>
                        <h5 class="font-semibold text-2xl text-white">Años en el Mercado</h5>
                        <p class="mt-2 text-[#ffffffb8]">Aprovecha nuestra experiencia para disfrutar de un servicio de reservación de vuelos de primera clase.</p>
                    </div>
                </div>
                <!-- Card 2 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="SkyLink Premios" class="object-cover -z-2 absolute w-full h-full" src="assets/img/scale-gallery-4.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">10+</h3>
                        <h5 class="font-semibold text-2xl text-white">Premios de la Industria</h5>
                        <p class="mt-2 text-[#ffffffb8]">Reconocidos por nuestro compromiso con la excelencia y la satisfacción del cliente.</p>
                    </div>
                </div>
                <!-- Card 3 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="SkyLink Innovación" class="object-cover -z-2 absolute w-full h-full" src="assets/img/scale-gallery-1.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">100+</h3>
                        <h5 class="font-semibold text-2xl text-white">Innovaciones en Viajes</h5>
                        <p class="mt-2 text-[#ffffffb8]">Invertimos en tecnología de punta para ofrecerte la mejor experiencia de reservación.</p>
                    </div>
                </div>
                <!-- Card 4 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 slide-in-from-r-8 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="SkyLink Global" class="object-cover -z-2 absolute w-full h-full" src="assets/img/grid-paris.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">50+</h3>
                        <h5 class="font-semibold text-2xl text-white">Destinos Globales</h5>
                        <p class="mt-2 text-[#ffffffb8]">Nuestra red global te conecta con destinos en todo el mundo con un servicio personalizado.</p>
                    </div>
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

                .slidedown-icon {
                    animation: slidedown-icon;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;
                }

                .box {
                    background-image: radial-gradient(var(--primary-300), var(--primary-600));
                    border-radius: 50% !important;
                    color: var(--primary-color-text);
                }
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
            .dark .shadow-none {
                box-shadow: none;
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
            .shadow-blue-card {
                --tw-shadow: var(--blue-card-shadow);
                --tw-shadow-colored: var(--blue-card-shadow);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            }
        `
    ]
})
export class WeareWidget {}
