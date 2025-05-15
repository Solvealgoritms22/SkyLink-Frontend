// landing.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { HeroWidget } from './components/herowidget/herowidget';
import { WeareWidget } from './components/wearewidget';
import { TestimonialWidget } from './components/testimonialwidget';
import { FooterWidget } from './components/footerwidget';
import { FeaturesWidget } from './components/featureswidget';
import { SolutionsWidget } from './components/solutionswidget';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, FeaturesWidget, HeroWidget, WeareWidget, TestimonialWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, WeareWidget, TestimonialWidget],
    template: `
        <!-- Al aplicar clases 'bg-surface-0' y 'dark:bg-surface-900', el fondo cambiará según el modo -->
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="overflow-hidden">
                <hero-widget></hero-widget>
                <weare-widget></weare-widget>
                <features-widget></features-widget>
                <testimonial-widget></testimonial-widget>
                <!--<solutions-widget></solutions-widget>-->
                <footer-widget></footer-widget>
            </div>
        </div>
    `,
})
export class Landing {}
