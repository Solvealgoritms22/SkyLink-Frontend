import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-manage-flights',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, DialogModule, InputTextModule, CalendarModule, CardModule],
    template: `
        <p-card class="p-6 rounded-2xl">
            <h2 class="text-xl font-semibold mb-4">Gestión de vuelos</h2>

            <div class="flex justify-end mb-4">
                <button pButton label="Agregar vuelo" icon="pi pi-plus" class="p-button-success"></button>
            </div>

            <p-table [value]="flights" class="text-sm">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Asientos</th>
                        <th class="w-28 text-center">Acciones</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-v>
                    <tr>
                        <td>{{ v.origen }}</td>
                        <td>{{ v.destino }}</td>
                        <td>{{ v.fechaSalida | date: 'longDate' }}</td>
                        <td>{{ v.horaSalida }}</td>
                        <td>{{ v.asientosDisponibles }}</td>
                        <td class="flex justify-center gap-2">
                            <!-- Editar -->
                            <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text"></button>
                            <!-- Eliminar -->
                            <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `
})
export class ManageFlightsComponent {
    flights = [
        {
            origen: 'Santo Domingo – Las Américas (SDQ)',
            destino: 'Newark – Liberty International (EWR)',
            fechaSalida: new Date('2025-06-01'),
            horaSalida: '10:30 AM',
            asientosDisponibles: 150
        },
        {
            origen: 'SDQ',
            destino: 'MIA',
            fechaSalida: new Date('2025-06-02'),
            horaSalida: '01:15 PM',
            asientosDisponibles: 120
        },
        {
            origen: 'PUJ',
            destino: 'PTY',
            fechaSalida: new Date('2025-06-03'),
            horaSalida: '08:00 AM',
            asientosDisponibles: 80
        },
        {
            origen: 'STI',
            destino: 'SJU',
            fechaSalida: new Date('2025-06-04'),
            horaSalida: '01:45 PM',
            asientosDisponibles: 60
        }
    ];
}
