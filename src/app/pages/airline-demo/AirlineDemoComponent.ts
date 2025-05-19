// landing.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingPendingComponent } from './BookingPendingComponent';
import { LoginComponent } from './LoginComponent';
import { ManageFlightsComponent } from './ManageFlightsComponent';
import { PaymentFormComponent } from './PaymentFormComponent';
import { RegisterComponent } from './RegisterComponent';
import { ReservationsComponent } from './ReservationsComponent';
import { SearchFlightsComponent } from './SearchFlightsComponent';
import { ViewFlightsComponent } from './ViewFlightsComponent';
import { ManageFlightsCreateComponent } from './ManageFlightsCreateComponent';
import { ManageFlightsEditComponent } from './ManageFlightsEditComponent ';
import { EmailTemplatePreviewComponent } from './EmailTemplatePreviewComponent';
import { EmailPaymentConfirmationComponent } from './EmailPaymentConfirmationComponent';
import { SeatSelectorComponent } from './SeatSelectorComponent';

@Component({
    selector: 'app-airline-demo',
    standalone: true,
    imports: [
        RouterModule,
        EmailPaymentConfirmationComponent,
        ManageFlightsCreateComponent,
        ManageFlightsEditComponent,
        EmailTemplatePreviewComponent,
        CommonModule,
        BookingPendingComponent,
        LoginComponent,
        ManageFlightsComponent,
        PaymentFormComponent,
        RegisterComponent,
        ReservationsComponent,
        SearchFlightsComponent,
        ViewFlightsComponent,
        SeatSelectorComponent
    ],
    template: `
        <div class="w-full grid justify-center">
            <div class="container grid gap-4 p-4">
                <app-view-flights></app-view-flights>
                <app-booking-pending></app-booking-pending>
                <app-login></app-login>
                <app-manage-flights></app-manage-flights>
                <app-payment-form></app-payment-form>
                <app-register></app-register>
                <app-reservations></app-reservations>
                <app-email-template-preview></app-email-template-preview>
                <app-manage-flights-create></app-manage-flights-create>
                <app-manage-flights-edit></app-manage-flights-edit>
                <app-search-flights></app-search-flights>
                <app-email-payment-confirmation></app-email-payment-confirmation>
                <app-seat-selector></app-seat-selector>
            </div>
        </div>
    `
})
export class AirlineDemoComponent {}
