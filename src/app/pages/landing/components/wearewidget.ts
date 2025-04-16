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
                    <h2 class="text-3xl lg:text-7xl font-semibold text-surface-950 dark:text-surface-0 [text-shadow:var(--black-card-shadow)]">Who We Are</h2>
                    <p class="mt-8 text-lg text-surface-500 dark:text-white/64">
                        With over 20 years of experience in the logistics industry, we are committed to providing tailored logistics solutions that enhance your supply chain efficiency and reliability. Our mission is to empower businesses with
                        innovative strategies, advanced technology, and dedicated customer support.
                    </p>
                    <div class="mt-16">
                        <h6 class="text-2xl font-semibold text-surface-950 dark:text-surface-0 [text-shadow:var(--black-card-shadow)]">Our Mission</h6>
                        <p class="mt-6 text-lg text-surface-500 dark:text-white/64">
                            We strive to deliver efficient, reliable, and scalable logistics solutions, continuously innovating to meet the evolving needs of our clients while promoting sustainability and integrity.
                        </p>
                    </div>
                </div>
                <!-- Image -->
                <div pAnimateOnScroll enterClass="animate-enter fade-in-10 zoom-in-50 animate-duration-1000" class="relative w-full max-w-[35rem] h-[31rem] overflow-hidden">
                    <img src="assets/img/who-we-are.png" alt="Logistic Who We Are Image" class="object-contain w-full h-full" />
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
                    <img alt="Logistic Who We Are Detail Image" class="object-cover -z-2 absolute w-full h-full" src="assets/img/who-we-are-detail-1.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">20+</h3>
                        <h5 class="font-semibold text-2xl text-white">Years on the market</h5>
                        <p class="mt-2 text-[#ffffffb8]">Leverage our extensive experience for top-notch logistics solutions tailored to your needs.</p>
                    </div>
                </div>
                <!-- Card 2 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 slide-in-from-l-8 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="Logistic Who We Are Detail Image" class="object-cover -z-2 absolute w-full h-full" src="assets/img/who-we-are-detail-2.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">17+</h3>
                        <h5 class="font-semibold text-2xl text-white">Award-Winning Service</h5>
                        <p class="mt-2 text-[#ffffffb8]">Recognized with industry awards, we deliver outstanding service and high standards.</p>
                    </div>
                </div>
                <!-- Card 3 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="Logistic Who We Are Detail Image" class="object-cover -z-2 absolute w-full h-full" src="assets/img/who-we-are-detail-3.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">172+</h3>
                        <h5 class="font-semibold text-2xl text-white">Innovation in Logistics</h5>
                        <p class="mt-2 text-[#ffffffb8]">We invest in cutting-edge technologies to keep you ahead of market trends.</p>
                    </div>
                </div>
                <!-- Card 4 -->
                <div
                    pAnimateOnScroll
                    enterClass="animate-enter fade-in-10 slide-in-from-r-8 animate-duration-3000"
                    leaveClass="animate-leave fade-out-0"
                    class="relative min-h-[30rem] rounded-4xl overflow-hidden shadow-blue-card dark:shadow-none animate-duration-500 animate-slidefadein"
                >
                    <img alt="Logistic Who We Are Detail Image" class="object-cover -z-2 absolute w-full h-full" src="assets/img/who-we-are-detail-4.jpg" />
                    <div class="absolute inset-0 -z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.70)_100%)]"></div>
                    <div class="absolute bottom-6 left-6 right-6">
                        <h3 class="text-8xl font-bold text-white">27+</h3>
                        <h5 class="font-semibold text-2xl text-white">Local Expertise</h5>
                        <p class="mt-2 text-[#ffffffb8]">Our global network and local experts provide personalized service and insights.</p>
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
