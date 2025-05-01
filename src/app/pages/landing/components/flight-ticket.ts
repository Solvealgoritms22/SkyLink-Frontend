import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../service/flight.service';

@Component({
    selector: 'flight-ticket',
    standalone: true,
    imports: [CommonModule],
    template: `
        <!-- Avión decorativo: se muestra solo si se provee la ruta banner -->
        <div class="ticket2">
            <img *ngIf="flight.banner" [src]="flight.banner" alt="aircraft" class="aircraft" />
            <div class="ticket" [style.--brand]="color">
                <!-- CABECERA RUTA -->
                <div class="header-text">
                    <span class="route-from">desde {{ flight.origin }}</span>
                    <span class="route-to w-[250px] truncate-lines">{{ flight.destination }}</span>
                    <span class="airport" *ngIf="flight.iata">({{ flight.iata }})</span>
                </div>

                <!-- SEPARADOR -->
                <div class="separator"><span class="dot"></span><span class="line"></span><span class="dot"></span></div>

                <!-- PRECIO -->
                <div class="price-box">
                    <div class="label"><span class="from">DESDE</span><span class="usd">US$</span></div>
                    <div class="price">{{ flight.price }}</div>
                    <sup class="asterisk">*</sup>
                </div>

                <p class="note">La tarifa anunciada es por persona y por trayecto.</p>

                <!-- DETALLES ADICIONALES -->
                <div class="flight-details">
                    <div>{{ tripType }} / {{ flight.flightClass }}</div>
                    <div>{{ dateRange }}</div>
                </div>

                <!-- FRANJA DE MARCA -->
                <div class="brand-bar">
                    <img *ngIf="flight.logo" [src]="flight.logo" alt="logo" />
                    <span>{{ flight.airline }}</span>
                </div>

                <!-- MUESCAS -->
                <span class="notch top"></span>
                <span class="notch bottom"></span>
            </div>
        </div>
    `,
    styles: `
        :host {
            display: grid;
            justify-content: center;
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
        .ticket2:hover {
            transform: translateY(-8px) scale(1.02);
        }
        .ticket2 {
            position: relative;
            width: 20rem;
            background: transparent;
            overflow: visible;
            height: 30rem;
            display: flex;
            transition: transform 0.25s ease;
            cursor: pointer;
        }
        /* avión */
        .aircraft {
            position: absolute;
            top: -40px;
            left: 50%;
            width: 200px;
            transform: translateX(-50%) rotate(-15deg);
            z-index: 2;
        }
        /* cabecera */
        .header-text {
            padding: 5.5rem 1.75rem 0 1.75rem;
            text-align: left;
        }
        .route-from {
            display: block;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.15em;
            color: var(--brand);
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .route-to {
            display: block;
            font-size: 1.6rem;
            font-weight: 800;
            line-height: 1;
            color: var(--brand);
        }
        .airport {
            display: block;
            font-size: 0.85rem;
            color: #666;
            margin-top: 2px;
        }
        /* separador */
        .separator {
            margin: 1rem 1.75rem;
            display: flex;
            align-items: center;
        }
        .separator .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--brand);
        }
        .separator .line {
            flex: 1;
            height: 1px;
            background: var(--brand);
            opacity: 0.8;
        }
        /* precio */
        .price-box {
            display: flex;
            align-items: flex-start;
            padding: 0 1.75rem;
            position: relative;
        }
        .label {
            display: flex;
            flex-direction: column;
            font-weight: 700;
            color: var(--brand);
            margin-right: 0.5rem;
        }
        .from {
            font-size: 0.9rem;
            line-height: 1;
        }
        .usd {
            font-size: 1.4rem;
            line-height: 1;
        }
        .price {
            font-size: 5rem;
            font-weight: 900;
            color: var(--brand);
            line-height: 0.9;
        }
        .asterisk {
            position: absolute;
            top: 0.4rem;
            right: 1.75rem;
            font-size: 2rem;
            color: var(--brand);
        }
        .note {
            text-align: center;
            font-size: 0.8rem;
            color: var(--brand);
            margin: 0.5rem 1.75rem 1.5rem;
            font-weight: 600;
        }
        /* detalles adicionales */
        .flight-details {
            font-size: 0.8rem;
            color: #666;
            text-align: right;
            padding: 0 1.75rem;
            margin-bottom: 1rem;
        }
        /* franja marca */
        .brand-bar {
            background: var(--brand);
            color: #fff;
            text-align: center;
            padding: 1rem 1rem;
            display: flex;
            flex-direction: row;
            gap: 0.4rem;
            align-items: center;
            justify-content: center;
            margin-top: auto;
        }
        .brand-bar img {
            height: 32px;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }
        .brand-bar span {
            font-weight: 700;
            font-size: 1.1rem;
        }
        /* notches */
        .notch {
            position: absolute;
            width: 24px;
            height: 24px;
            background: rgb(237 237 237);
            border-radius: 50%;
            box-shadow: 0 0 0 2px #e5e7eb;
            left: -12px;
        }
        .notch.top {
            top: calc(5.5rem + 112px);
        }
        .notch.bottom {
            bottom: 48px;
        }
        .truncate-lines {
            display: -webkit-box;
            -webkit-line-clamp: 2; /* Limita el texto a 2 líneas */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    `
})
export class FlightTicketComponent {
    @Input() flight!: Flight;

    get color() {
        return this.flight.color || '#1E40AF'; // Azul predeterminado
    }

    get tripType(): string {
        return this.flight.returnDate ? 'Ida y vuelta' : 'Solo ida';
    }

    get dateRange(): string {
        return this.flight.returnDate ? `${this.flight.date} - ${this.flight.returnDate}` : this.flight.date;
    }
}
