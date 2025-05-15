import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DatePickerModule } from 'primeng/datepicker'; // For p-datepicker
import { TopbarWidget } from '../topbarwidget.component';
import { FlightService, Flight } from '../../../service/flight.service';
import { FlightTicketComponent } from '../flight-ticket';
import { AnimateOnScroll } from 'primeng/animateonscroll';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../../core/services/auth.service';
import { Passenger } from '../../../../core/models/passenger.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [CommonModule, ToastModule, ButtonModule, RippleModule, DatePickerModule, TopbarWidget, FlightTicketComponent, PaginatorModule, AnimateOnScroll, ProgressSpinnerModule, FormsModule, DropdownModule, DialogModule, SelectModule, RouterLink],
    providers: [MessageService],
    templateUrl: 'herowidget.component.html',
    styleUrl: 'herowidget.css'
})
export class HeroWidget {
    customers = [
        { name: '', logo: 'assets/logos/Logo_web_Arajet.png' },
        { name: '', logo: 'assets/logos/skyhighdominicana-logo.png' },
        { name: '', logo: 'assets/logos/logotipo-aircentury.png' },
        { name: '', logo: 'assets/logos/logo-red-air.png' },
        { name: '', logo: 'assets/logos/americanairlines.jpg' }
    ];
    /* ▼ SELECTS dinámicos -------------------------------------------------- */
    origins: { label: string; value: string }[] = [];
    destinations: { label: string; value: string }[] = [];

    /* ▼ MODALES y timers --------------------------------------------------- */
    displayModal = false; // resultados de búsqueda
    reservationDialog = false; // configurar vuelo
    invoiceDialog = false; // confirmación + cuenta atrás
    invoiceMinimized = false; // widget flotante mini
    loginDialog = false; // login provisional
    private intervalId: any;
    reservedCount = 0;
    countdown = 50; // 50 segundos
    get countdownDisplay(): string {
        const m = Math.floor(this.countdown / 60)
            .toString()
            .padStart(2, '0');
        const s = (this.countdown % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    /* ▼ FLAGS -------------------------------------------------------------- */
    loading = false; // spinner listado vuelos
    searching = false; // spinner botón Buscar
    reservationInProgress = false; // evita nuevas reservas

    /* ▼ LISTADO de vuelos -------------------------------------------------- */
    flights: Flight[] = [];
    filteredFlights: Flight[] = [];
    pagedFlights: Flight[] = [];
    placeholders: number[] = [];
    showFlights = false;
    rows = 3;
    total = 0;

    /* ▼ SELECCIÓN del usuario --------------------------------------------- */
    selectedOrigin = '';
    selectedDestination = '';
    selectedFlight: Flight | null = null;
    pendingFlight: Flight | null = null;

    /* ▼ RESERVA ------------------------------------------------------------ */

    selectedTripType: 'oneway' | 'roundtrip' = 'oneway';
    selectedDepartureDate: Date | null = null;
    selectedReturnDate: Date | null = null;

    passengerCount = 1;
    passengerDetails: Passenger[] = [];
    classOptions = [
        { label: 'Económica', value: 'Económica', multiplier: 1 },
        { label: 'Enterprise', value: 'Enterprise', multiplier: 1.5 }
    ];
    selectedClass = this.classOptions[0].value;
    totalPrice = 0;

    /* ▼ DATEPICKER disponibilidad ----------------------------------------- */
    validDepartureDates: Date[] = [];
    validReturnDates: Date[] = [];
    minDeparture!: Date;
    maxDeparture!: Date;
    minReturn!: Date;
    maxReturn!: Date;
    disabledDepartureDates: Date[] = [];
    disabledReturnDates: Date[] = [];

    /* ▼ LOGIN provisional -------------------------------------------------- */
    loginEmail = '';
    loginPassword = '';
    loginLoading = false;
    loginError = '';

    /* ─────────────────────────────────────────────
     CONSTRUCTOR
  ───────────────────────────────────────────── */
    constructor(
        private flightSvc: FlightService,
        private authSvc: AuthService,
        private msgSvc: MessageService
    ) {
        this.flightSvc.getFlights().subscribe((flights) => {
            /* Orígenes y destinos */
            this.origins = Array.from(new Set(flights.map((f) => f.origin))).map((o) => ({ label: o, value: o }));
            this.destinations = Array.from(new Set(flights.map((f) => f.destination))).map((d) => ({ label: d, value: d }));

            /* ① Timestamps a medianoche */
            const depTs = flights.map((f) => this.toMidnight(f.date).getTime());
            const retTs = flights.filter((f) => f.returnDate).map((f) => this.toMidnight(f.returnDate!).getTime());

            /* ② Límites absolutos */
            this.minDeparture = new Date(Math.min(...depTs));
            this.maxDeparture = new Date(Math.max(...depTs));
            this.minReturn = new Date(Math.min(...retTs));
            this.maxReturn = new Date(Math.max(...retTs));

            /* ③ Rango completo y huecos */
            const allDepRange = this.rangeBetween(this.minDeparture, this.maxDeparture);
            const allRetRange = this.rangeBetween(this.minReturn, this.maxReturn);

            this.disabledDepartureDates = allDepRange.filter((d) => !depTs.includes(d.getTime()));
            this.disabledReturnDates = allRetRange.filter((d) => !retTs.includes(d.getTime()));
        });
    }

    /* ─────────────────────────────────────────────
   UTILIDAD: normalizar a medianoche
───────────────────────────────────────────── */
    private toMidnight(date: string | Date): Date {
        const d = typeof date === 'string' ? new Date(date) : new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    private rangeBetween(start: Date, end: Date): Date[] {
        const arr: Date[] = [];
        const cur = new Date(start);
        while (cur <= end) {
            arr.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
        return arr;
    }

    formatTime(time: string): string {
        const [h, m] = time.split(':').map(Number);
        const ampm = h < 12 ? 'AM' : 'PM';
        const hh = h % 12 || 12;
        return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    /* ─────────────────────────────────────────────
   BÚSQUEDA
───────────────────────────────────────────── */
    search() {
        if (!this.selectedOrigin || !this.selectedDestination || this.searching) {
            return;
        }

        this.searching = true;

        this.flightSvc.getFlights().subscribe({
            next: (flights) => {
                /* ——— comparación de día ——— */
                const sameDay = (d1: Date, d2: string | Date) => this.toMidnight(d1).getTime() === this.toMidnight(d2).getTime();

                /* ——— filtros dinámicos ——— */
                const byOriginDest = (f: Flight) => f.origin === this.selectedOrigin && f.destination === this.selectedDestination;

                const byDeparture = this.selectedDepartureDate ? (f: Flight) => sameDay(this.selectedDepartureDate!, f.date) : (_: Flight) => true;

                const byReturn = this.selectedReturnDate ? (f: Flight) => !!f.returnDate && sameDay(this.selectedReturnDate!, f.returnDate!) : (_: Flight) => true;

                /* ——— aplicar filtros ——— */
                this.filteredFlights = flights.filter((f) => byOriginDest(f) && byDeparture(f) && byReturn(f));

                this.displayModal = true;
                this.searching = false;
            },
            error: () => (this.searching = false)
        });
    }

    /* ─────────────────────────────────────────────
     LISTADO DE VUELOS
  ───────────────────────────────────────────── */
    toggleFlights() {
        this.showFlights = !this.showFlights;
        if (this.showFlights && !this.flights.length) this.loadFlights();
    }
    private loadFlights() {
        this.loading = true;
        this.flightSvc.getFlights().subscribe({
            next: (f) => {
                this.flights = f;
                this.total = f.length;
                this.updatePage({ page: 0, rows: this.rows });
                this.loading = false;
            },
            error: () => (this.loading = false)
        });
    }
    updatePage(e: { page?: number; rows?: number }) {
        const page = e.page ?? 0;
        const rows = e.rows ?? this.rows;
        this.pagedFlights = this.flights.slice(page * rows, page * rows + rows);

        const empty = rows - this.pagedFlights.length;
        this.placeholders = Array(Math.max(0, empty)).fill(0);
    }

    /* ─────────────────────────────────────────────
     RESERVAR
  ───────────────────────────────────────────── */
    async reserveFlight(f: Flight) {
        if (this.reservationInProgress) {
            this.msgSvc.add({
                severity: 'warn',
                summary: 'Reserva en curso',
                detail: 'Espera a que expire o cancela la reserva antes de crear otra.',
                life: 6000
            });
            return;
        }

        if (!this.authSvc.isLoggedIn) {
            this.pendingFlight = f;
            this.loginDialog = true;
            return;
        }

        this.openReservationModal(f);
    }

    private async openReservationModal(f: Flight) {
        this.selectedFlight = f;
        this.selectedTripType = f.returnDate ? 'roundtrip' : 'oneway';
        this.selectedDepartureDate = new Date(f.date);
        this.selectedReturnDate = f.returnDate ? new Date(f.returnDate) : null;

        /* Pasajeros */
        this.passengerCount = 1;
        this.adjustPassengerDetails();

        /* Prefill del pasajero 1 */
        try {
            const u = await this.authSvc.getUser();
            Object.assign(this.passengerDetails[0], {
                firstName: u.name,
                lastName: u.lastname,
                nationality: u.nacionalidad,
                fechaNacimiento: u.fechaNacimiento,
                gender: u.genero.toLowerCase().startsWith('m') ? 'Masculino' : u.genero.toLowerCase().startsWith('f') ? 'Femenino' : 'Otro'
            });
        } catch {
            console.warn('No se pudo prefilar user');
        }

        this.recalculateTotal();
        this.reservationDialog = true;
    }

    /* ─ LOGIN provisional ─ */
    async onLoginSubmit() {
        this.loginLoading = true;
        this.loginError = '';
        try {
            const ok = await this.authSvc.login(this.loginEmail, this.loginPassword);
            if (ok && this.pendingFlight) {
                this.loginDialog = false;
                this.openReservationModal(this.pendingFlight);
                this.pendingFlight = null;
            } else {
                this.loginError = 'Credenciales inválidas';
            }
        } catch {
            this.loginError = 'Error al iniciar sesión';
        } finally {
            this.loginLoading = false;
        }
    }

    /* ─ PASAJEROS ─ */
    onPassengerCountChange() {
        if (!this.selectedFlight) return;
        this.passengerCount = Math.max(1, Math.min(this.passengerCount, this.selectedFlight.seats));
        this.adjustPassengerDetails();
        this.recalculateTotal();
    }
    private adjustPassengerDetails() {
        const diff = this.passengerCount - this.passengerDetails.length;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                this.passengerDetails.push({
                    firstName: '',
                    lastName: '',
                    fechaNacimiento: '',
                    gender: '',
                    nationality: '',
                    passportNumber: ''
                });
            }
        } else if (diff < 0) {
            this.passengerDetails.splice(this.passengerCount);
        }
    }

    /* ─ CÁLCULO DE PRECIO ─ */
    recalculateTotal() {
        if (!this.selectedFlight) return;
        if (this.selectedTripType === 'roundtrip' && !this.selectedReturnDate) return;

        const base = this.selectedFlight.price;
        const clsMult = this.classOptions.find((c) => c.value === this.selectedClass)!.multiplier;
        const tripMult = this.selectedTripType === 'roundtrip' ? 2 : 1;

        this.totalPrice = Math.round(base * clsMult * tripMult * this.passengerCount);
    }

    /* ─ CONFIRMAR RESERVA ─ */
    confirmReservation() {
        /* Validación */
        for (let i = 0; i < this.passengerDetails.length; i++) {
            const p = this.passengerDetails[i];
            if (!p.firstName || !p.lastName || !p.fechaNacimiento || !p.gender || !p.nationality) {
                this.msgSvc.add({
                    severity: 'warn',
                    summary: 'Datos incompletos',
                    detail: `Completa todos los campos del pasajero ${i + 1}.`,
                    life: 6000,
                    styleClass: 'toast-warn'
                });

                return;
            }
        }

        /* Reducir asientos */
        if (this.selectedFlight) {
            this.reservedCount = this.passengerCount;
            this.selectedFlight.seats -= this.reservedCount;
        }

        /* Abrir confirmación + timer */
        this.reservationInProgress = true;
        this.openInvoice();
    }

    /* ─ FACTURA & TIMER ─ */
    private openInvoice() {
        this.invoiceMinimized = false;
        this.invoiceDialog = true;
        this.startCountdown();
    }
    /** Devuelve “X seg”, “Y min” u “Z h” según el valor */
    private countdownLabel(seconds: number): string {
        if (seconds < 60) {
            return `${seconds} seg`;
        }
        if (seconds < 3600) {
            const m = Math.ceil(seconds / 60);
            return `${m} min`;
        }
        const h = Math.ceil(seconds / 3600);
        return `${h} h`;
    }

    private startCountdown() {
        this.stopCountdown();
        this.countdown = 50;
        this.reservationInProgress = true; // bloquea nuevas reservas
        this.intervalId = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.intervalId);
                this.releaseSeats();
            }
        }, 1000);
        this.msgSvc.add({
            severity: 'success',
            summary: 'Reserva confirmada',
            detail: 'Tienes ' + this.countdownLabel(this.countdown) + ' para completar el pago.',
            life: 5000
        });
    }
    /** Detiene (si existe) el intervalo y lo marca como inactivo */
    private stopCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private releaseSeats() {
        this.stopCountdown();
        if (this.selectedFlight) {
            this.selectedFlight.seats += this.reservedCount;
        }

        this.invoiceDialog = false; // cierra (si estaba abierto)
        this.invoiceMinimized = false;
        this.reservationInProgress = false; // desbloquea
        this.countdown = 0; // ← evita valores negativos
        this.msgSvc.add({
            severity: 'info',
            summary: 'Reserva cancelada',
            detail: 'Los asientos han sido liberados.',
            life: 5000,
            styleClass: 'toast-info'
        });
    }

    /* ─ Al pulsar botón “Cerrar” del dialog ─ */
    closeInvoiceViewOnly() {
        this.invoiceDialog = false; // oculta diálogo grande
        this.invoiceMinimized = true; // muestra flotante
    }

    /* ─ volver a abrir desde el widget ─ */
    reopenInvoice() {
        this.invoiceDialog = true;
        this.invoiceMinimized = false;
    }

    /* ─ Al pulsar “Cancelar reserva” ─ */
    cancelReservationManually() {
        this.releaseSeats(); // detiene timer y libera
    }
}
