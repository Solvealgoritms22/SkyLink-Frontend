import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';

// Import model
import { generalInfoData } from '../models/database-info.model';

interface DatabaseStatistic {
    label: string;
    value: string | number;
    icon?: string;
}

interface DatabaseEngine {
    name: string;
    version: string;
    features: string[];
}

@Component({
    selector: 'app-general-info-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, CardModule, TooltipModule, ChipModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">{{ title }}</h2>
            <p class="text-slate-300 mb-6">{{ description }}</p>

            <p-tabView styleClass="custom-tabview">
                <!-- Información General -->
                <p-tabPanel header="Información General">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div *ngFor="let stat of getDbStats" class="bg-surface-700 p-4 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                                <i *ngIf="stat.icon" class="pi {{ stat.icon }} text-primary"></i>
                                <h3 class="text-md font-medium text-gray-300">{{ stat.label }}</h3>
                            </div>
                            <p class="text-xl font-semibold text-slate-200">{{ stat.value }}</p>
                        </div>
                    </div>

                    <!-- Motor de Base de Datos -->
                    <div *ngIf="getDbEngine" class="mb-6">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Motor de Base de Datos</h3>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <div class="flex items-center gap-2 mb-4">
                                <h4 class="text-xl font-semibold text-slate-200">{{ getDbEngine.name }}</h4>
                                <p-chip label="{{ getDbEngine.version }}" styleClass="bg-primary-600"></p-chip>
                            </div>
                            <div class="mb-4">
                                <h5 class="text-md font-medium text-gray-300 mb-2">Características</h5>
                                <div class="flex flex-wrap gap-2">
                                    <p-chip *ngFor="let feature of getDbEngine.features" label="{{ feature }}" styleClass="bg-surface-600"></p-chip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Diagrama ER -->
                    <div *ngIf="getErDiagramUrl" class="mb-6">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Diagrama Entidad-Relación</h3>
                        <div class="flex justify-center bg-surface-700 p-4 rounded-lg">
                            <img [src]="getErDiagramUrl" alt="Diagrama Entidad-Relación" class="max-w-full h-auto" />
                        </div>
                        <p *ngIf="getErDiagramDescription" class="text-sm text-center text-gray-400 mt-2">{{ getErDiagramDescription }}</p>
                    </div>

                    <!-- Estructura de Directorios -->
                    <div *ngIf="getDirectoryStructure && getDirectoryStructure.length > 0" class="mb-6">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Estructura de Directorios</h3>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <pre class="text-sm overflow-x-auto text-slate-300">{{ getDirectoryStructure }}</pre>
                        </div>
                    </div>

                    <!-- Historial de Versiones -->
                    <div *ngIf="getVersionHistory && getVersionHistory.length > 0" class="mb-6">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Historial de Versiones</h3>
                        <div class="relative overflow-x-auto">
                            <table class="w-full border-collapse table-auto">
                                <thead class="bg-surface-600 text-slate-200">
                                    <tr>
                                        <th class="border border-surface-500 p-2 text-left">Versión</th>
                                        <th class="border border-surface-500 p-2 text-left">Fecha</th>
                                        <th class="border border-surface-500 p-2 text-left">Cambios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let version of getVersionHistory" class="hover:bg-surface-200">
                                        <td class="border border-surface-500 p-2 font-mono">{{ version.version }}</td>
                                        <td class="border border-surface-500 p-2">{{ version.date }}</td>
                                        <td class="border border-surface-500 p-2">{{ version.changes }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Script SQL -->
                <p-tabPanel header="Script SQL">
                    <app-code-card language="sql" [code]="getSqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>

                <!-- Guía de Convenciones -->
                <p-tabPanel header="Convenciones" *ngIf="getConventions && getConventions.length > 0">
                    <div class="mb-6">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Convenciones de Nomenclatura</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div *ngFor="let convention of getConventions" class="bg-surface-700 p-4 rounded-lg">
                                <h4 class="text-md font-medium mb-2 text-slate-200">{{ convention.title }}</h4>
                                <p class="text-sm text-slate-300 mb-2">{{ convention.description }}</p>
                                <div class="bg-surface-600 p-2 rounded">
                                    <code class="text-xs text-slate-200">{{ convention.example }}</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </p-tabPanel>
            </p-tabView>
        </section>
    `,
    styles: [
        `
            :host ::ng-deep .custom-tabview .p-tabview-nav {
                background: var(--surface-700);
                border-color: var(--surface-600);
            }
            :host ::ng-deep .custom-tabview .p-tabview-nav li .p-tabview-nav-link {
                color: var(--text-color);
                background: var(--surface-700);
            }
            :host ::ng-deep .custom-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
                color: var(--primary-color);
                border-color: var(--primary-color);
            }
            :host ::ng-deep .p-tabpanels {
                background: var(--surface-800);
                border-radius: 0.5rem;
            }
        `
    ]
})
export class GeneralInfoSectionComponent {
    @Input() title = 'Sistema de Reservas de Aerolíneas';
    @Input() description = 'Documentación detallada del esquema SQL para un sistema completo de reservas de aerolíneas, incluyendo tablas, funciones, procedimientos almacenados, triggers, vistas, eventos y configuración de seguridad.';
    @Input() sqlCode = '';
    @Input() dbStats: DatabaseStatistic[] = [];
    @Input() dbEngine?: DatabaseEngine;
    @Input() erDiagramUrl = '';
    @Input() erDiagramDescription = '';
    @Input() directoryStructure = '';
    @Input() versionHistory: { version: string; date: string; changes: string }[] = [];
    @Input() conventions: { title: string; description: string; example: string }[] = [];
    @Input() generalInfoDetail?: any; // The general info data model

    constructor(private messageService: MessageService) {}

    // Getters to access data from the model if available
    get getDbStats(): DatabaseStatistic[] {
        return this.generalInfoDetail?.databaseStats || this.dbStats;
    }

    get getDbEngine(): DatabaseEngine | undefined {
        return this.generalInfoDetail?.databaseEngine || this.dbEngine;
    }

    get getErDiagramUrl(): string {
        return this.generalInfoDetail?.erDiagramUrl || this.erDiagramUrl;
    }

    get getErDiagramDescription(): string {
        return this.generalInfoDetail?.erDiagramDescription || this.erDiagramDescription;
    }

    get getDirectoryStructure(): string {
        return this.generalInfoDetail?.directoryStructure || this.directoryStructure;
    }

    get getVersionHistory(): { version: string; date: string; changes: string }[] {
        return this.generalInfoDetail?.versionHistory || this.versionHistory;
    }

    get getConventions(): { title: string; description: string; example: string }[] {
        return this.generalInfoDetail?.namingConventions || this.conventions;
    }

    get getSqlCode(): string {
        return this.generalInfoDetail?.sqlScript || this.sqlCode;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
