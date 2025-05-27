import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { TableColumn, TableRelation, TableIndex, ExampleQuery } from '../models/sql-data-dictionary.model';

@Component({
    selector: 'app-table-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, ChipModule, TooltipModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">
                Tabla:
                <span class="text-sm px-2 py-1 rounded-md font-mono bg-blue-400/10 text-blue-400">{{ getTableName }}</span>
            </h2>

            <p class="text-slate-300 mb-4">{{ tableDescription }}</p>

            <p-tabView styleClass="bg-surface-800">
                <!-- Estructura de la tabla -->
                <p-tabPanel header="Estructura">
                    <div class="mb-8 bg-surface-900 p-4 rounded-lg shadow text-slate-200">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Diccionario de Datos</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full border-collapse table-auto">
                                <thead>
                                    <tr class="bg-surface-600">
                                        <th class="border border-surface-500 p-2 text-left">Columna</th>
                                        <th class="border border-surface-500 p-2 text-left">Tipo de Dato</th>
                                        <th class="border border-surface-500 p-2 text-left">Restricciones</th>
                                        <th class="border border-surface-500 p-2 text-left">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let column of tableColumns" class="hover:bg-surface-700">
                                        <td class="border border-surface-500 p-2">
                                            {{ column.name }}
                                            <span *ngIf="column.isPrimaryKey" class="text-yellow-500 ml-1" pTooltip="Clave primaria">🔑</span>
                                            <span *ngIf="column.isForeignKey" class="text-blue-400 ml-1" pTooltip="Clave foránea">🔗</span>
                                        </td>
                                        <td class="border border-surface-500 p-2 font-mono text-sm">{{ column.type }}</td>
                                        <td class="border border-surface-500 p-2">
                                            <div class="flex flex-wrap gap-1">
                                                <p-chip *ngIf="column.isPrimaryKey" label="PK" styleClass="bg-yellow-600 text-xs"></p-chip>
                                                <p-chip *ngIf="column.isForeignKey" label="FK" styleClass="bg-blue-600 text-xs"></p-chip>
                                                <p-chip *ngIf="column.isUnique" label="UNIQUE" styleClass="bg-purple-600 text-xs"></p-chip>
                                                <p-chip *ngIf="!column.isNullable" label="NOT NULL" styleClass="bg-red-600 text-xs"></p-chip>
                                                <span *ngIf="column.defaultValue" class="text-xs text-gray-400">DEFAULT: {{ column.defaultValue }}</span>
                                            </div>
                                        </td>
                                        <td class="border border-surface-500 p-2">{{ column.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Relaciones -->
                    <div *ngIf="tableRelations && tableRelations.length > 0" class="mb-8">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Relaciones</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                            <div
                                *ngFor="let relation of tableRelations"
                                class="bg-surface-700 p-4 rounded-lg border-l-4"
                                [ngClass]="{
                                    'border-green-500': relation.type === 'one-to-one',
                                    'border-blue-500': relation.type === 'one-to-many',
                                    'border-purple-500': relation.type === 'many-to-one',
                                    'border-yellow-500': relation.type === 'many-to-many'
                                }"
                            >
                                <div class="flex items-center gap-2 mb-2 text-slate-200">
                                    <span class="font-semibold">{{ relation.table }}</span>
                                    <span class="text-xs px-2 py-1 rounded bg-surface-600">
                                        {{ relation.type === 'one-to-one' ? '1:1' : relation.type === 'one-to-many' ? '1:N' : relation.type === 'many-to-one' ? 'N:1' : 'N:M' }}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-300 mb-2">{{ relation.description }}</p>
                                <div class="text-xs">
                                    <div *ngFor="let col of relation.columns" class="flex items-center gap-1 text-slate-200">
                                        <span class="font-mono">{{ getTableName }}.{{ col.local }}</span>
                                        <span>→</span>
                                        <span class="font-mono">{{ relation.table }}.{{ col.foreign }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Índices si existen -->
                    <div *ngIf="tableIndexes && tableIndexes.length > 0" class="mb-8">
                        <h3 class="text-lg font-medium text-slate-200 mb-3">Índices</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full border-collapse table-auto">
                                <thead>
                                    <tr class="bg-surface-600 text-slate-200">
                                        <th class="border border-surface-500 p-2 text-left">Nombre</th>
                                        <th class="border border-surface-500 p-2 text-left">Columnas</th>
                                        <th class="border border-surface-500 p-2 text-left">Tipo</th>
                                        <th class="border border-surface-500 p-2 text-left">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let index of tableIndexes" class="hover:bg-surface-200">
                                        <td class="border border-surface-500 p-2">{{ index.name }}</td>
                                        <td class="border border-surface-500 p-2 font-mono text-sm">{{ index.columns.join(', ') }}</td>
                                        <td class="border border-surface-500 p-2">{{ index.type }}</td>
                                        <td class="border border-surface-500 p-2">{{ index.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </p-tabPanel>
                <!-- Script SQL -->
                <p-tabPanel header="Script SQL">
                    <app-code-card language="sql" [code]="tableSQLCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>
                <!-- Ejemplos de consulta -->
                <p-tabPanel header="Ejemplos de Consultas" *ngIf="tableExampleQueries && tableExampleQueries.length > 0">
                    <div *ngFor="let query of tableExampleQueries; let i = index" class="mb-6">
                        <h3 class="text-md font-medium text-slate-200 mb-2">{{ query.description }}</h3>
                        <app-code-card language="sql" [code]="query.sql" (copy)="onCopy(query.sql)"></app-code-card>
                    </div>
                </p-tabPanel>
            </p-tabView>
        </section>
    `,
    styles: [
        `
            :host ::ng-deep .p-tabpanels {
                background: var(--surface-800);
                border-radius: 0.5rem;
            }
        `
    ]
})
export class TableSectionComponent {
    @Input() tableName = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() columns: TableColumn[] = [];
    @Input() relations: TableRelation[] = [];
    @Input() indexes: { name: string; columns: string[]; type: string; description: string }[] = [];
    @Input() exampleQueries: { description: string; sql: string }[] = [];
    @Input() tableDetail?: any; // TableDetail no está definido explícitamente en los modelos

    constructor(private messageService: MessageService) {}

    // Getters para acceder a las propiedades del detalle de la tabla si está disponible
    get getTableName(): string {
        return this.tableDetail?.tableName || this.tableName;
    }

    get tableDescription(): string {
        return this.tableDetail?.description || this.description;
    }

    get tableColumns(): TableColumn[] {
        return this.tableDetail?.columns || this.columns;
    }

    get tableRelations(): TableRelation[] {
        return this.tableDetail?.relations || this.relations;
    }

    get tableIndexes(): TableIndex[] {
        return this.tableDetail?.indexes || this.indexes;
    }

    get tableExampleQueries(): ExampleQuery[] {
        return this.tableDetail?.exampleQueries || this.exampleQueries;
    }

    get tableSQLCode(): string {
        return this.tableDetail?.createStatement || this.sqlCode;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
