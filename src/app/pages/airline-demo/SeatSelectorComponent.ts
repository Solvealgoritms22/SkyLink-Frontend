import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

type PaxType = 'Adulto' | 'Adolescente' | 'Niño' | 'Bebé';
interface Passenger {
    type: PaxType;
    name: string;
}

interface Seat {
    code: string;
    class: 'Económica' | 'Clásica' | 'Ejecutiva';
    price: number;
    taken: boolean;
}

@Component({
    selector: 'app-seat-selector',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <button pButton label="Elegir asiento" (click)="visible = true" class="p-button-primary"></button>

        <p-dialog [(visible)]="visible" modal header="Selecciona tus asientos" [style]="{ width: '800px' }" [dismissableMask]="true">
            <div class="text-sm mb-4 text-center">
                Pasajeros que requieren asiento: <strong>{{ requiredSeats }}</strong> | Seleccionados: <strong>{{ selected.length }}</strong> | Disponibles: <strong>{{ availableSeats }}</strong>
            </div>

            <div class="relative flex justify-center">
                <!-- Ícono de avión de fondo -->
                <i class="fas fa-plane text-gray-200 absolute text-[300px] transform rotate-90 opacity-50"></i>

                <!-- Asientos superpuestos -->
                <div class="grid grid-cols-4 gap-2 relative z-10 p-4 bg-white bg-opacity-80 rounded-lg shadow-lg">
                    <ng-container *ngFor="let cls of seatClasses">
                        <ng-container *ngFor="let seat of seatsByClass(cls)">
                            <p-button
                                [label]="seat.code"
                                [disabled]="seat.taken"
                                (onClick)="toggleSeat(seat)"
                                [severity]="buttonProps(seat).severity"
                                [outlined]="buttonProps(seat).outlined"
                                [styleClass]="isSelected(seat) ? 'selected-seat' : ''"
                                class="w-full h-10 text-sm"
                            ></p-button>
                        </ng-container>
                    </ng-container>
                </div>
            </div>

            <!-- Leyenda -->
            <div class="flex justify-center gap-4 mt-4 text-xs z-20 relative">
                <span><span class="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Económica</span>
                <span><span class="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Clásica</span>
                <span><span class="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Ejecutiva</span>
            </div>

            <div class="mt-6 flex justify-between items-center">
                <div>
                    Total:
                    <strong>{{ totalPrice | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
                </div>
                <button pButton label="Confirmar" icon="pi pi-check" [disabled]="selected.length !== requiredSeats" (click)="confirm()"></button>
            </div>
        </p-dialog>
    `,
    styles: `

        /* si necesitas diferenciar por clase podrías usar: */
        .selected-seat.info {
            background: var(--p-button-outlined-info-active-background) !important;
        }
    `
})
export class SeatSelectorComponent {
    passengers: Passenger[] = [
        { type: 'Adulto', name: 'Juan' },
        { type: 'Adolescente', name: 'Luis' },
        { type: 'Niño', name: 'Ana' },
        { type: 'Bebé', name: 'Carlitos' }
    ];

    seatClasses = ['Económica', 'Clásica', 'Ejecutiva'] as const;

    prices = { Económica: 0, Clásica: 20, Ejecutiva: 50 };

    seats: Seat[] = this.generateSeats(); // ← esta línea ahora es segura
    selected: Seat[] = [];
    visible = false;

    // getters
    get requiredSeats() {
        return this.passengers.filter((p) => p.type !== 'Bebé').length;
    }
    get availableSeats() {
        return this.seats.filter((s) => !s.taken && !this.isSelected(s)).length;
    }
    get totalPrice() {
        return this.selected.reduce((sum, seat) => sum + seat.price, 0);
    }

    isSelected(seat: Seat) {
        return this.selected.some((s) => s.code === seat.code);
    }

    toggleSeat(seat: Seat) {
        if (seat.taken) return;
        this.isSelected(seat) ? (this.selected = this.selected.filter((s) => s.code !== seat.code)) : this.selected.length < this.requiredSeats && (this.selected = [...this.selected, seat]);
    }

    confirm() {
        alert(`Confirmado: ${this.selected.map((s) => s.code).join(', ')} | Total: ${this.totalPrice} USD`);
        this.visible = false;
    }

    seatsByClass(cls: Seat['class']) {
        return this.seats.filter((s) => s.class === cls);
    }

    buttonProps(seat: Seat) {
        if (seat.taken) {
            return { severity: 'secondary', outlined: true } as const;
        }

        if (this.isSelected(seat)) {
            // Seleccionado: fondo sólido, sin outlined
            switch (seat.class) {
                case 'Económica':
                    return { severity: 'success', outlined: false } as const; // Verde sólido
                case 'Clásica':
                    return { severity: 'info', outlined: false } as const; // Azul sólido
                case 'Ejecutiva':
                    return { severity: 'warn', outlined: false } as const; // Amarillo sólido
                default:
                    return { severity: 'secondary', outlined: false } as const;
            }
        }

        // No seleccionado: fondo outlined (borde color), sin relleno sólido
        switch (seat.class) {
            case 'Económica':
                return { severity: 'success', outlined: true } as const; // verde borde
            case 'Clásica':
                return { severity: 'info', outlined: true } as const; // azul borde
            case 'Ejecutiva':
                return { severity: 'warn', outlined: true } as const; // amarillo borde
            default:
                return { severity: 'secondary', outlined: true } as const;
        }
    }

    generateSeats(): Seat[] {
        const seats: Seat[] = [];
        const seatMap: Record<string, Seat['class']> = {
            A: 'Ejecutiva',
            B: 'Ejecutiva',
            C: 'Clásica',
            D: 'Clásica',
            E: 'Económica',
            F: 'Económica'
        };

        for (const row of ['A', 'B', 'C', 'D', 'E', 'F'] as const) {
            for (let col = 1; col <= 4; col++) {
                const seatClass = seatMap[row];
                seats.push({
                    code: `${row}${col}`,
                    class: seatClass,
                    price: this.prices[seatClass],
                    taken: Math.random() < 0.1
                });
            }
        }
        return seats;
    }
}
