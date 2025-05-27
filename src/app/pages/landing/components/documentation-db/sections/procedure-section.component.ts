import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ProcedureDetail } from '../models/procedure-details.model';

interface ProcedureParameter {
    name: string;
    type: string;
    direction: 'IN' | 'OUT' | 'INOUT';
    description: string;
    defaultValue?: string;
}

interface ProcedureTableOperation {
    tableName: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
    description: string;
}

interface ProcedureTransactionInfo {
    hasTransaction: boolean;
    transactionLevel: 'READ COMMITTED' | 'READ UNCOMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE' | string;
    errorHandling: string;
}

@Component({
    selector: 'app-procedure-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">
                Procedimiento:
                <span class="text-sm px-2 py-1 rounded-md font-mono bg-purple-400/10 text-purple-400">{{ getProcedureName }}</span>
            </h2>
            <p class="text-slate-300 mb-4">{{ procedureDescription }}</p>

            <p-tabView styleClass="custom-tabview">
                <!-- Detalles del procedimiento -->
                <p-tabPanel header="Detalles">
                    <!-- Parámetros -->
                    <div class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Parámetros:</h4>
                        <div *ngIf="procedureParameters && procedureParameters.length > 0; else noParameters" class="overflow-x-auto rounded-md shadow">
                            <table class="w-full border-collapse table-auto">
                                <thead class="bg-surface-600 text-slate-200">
                                    <tr>
                                        <th class="border border-surface-500 p-2 text-left">Nombre</th>
                                        <th class="border border-surface-500 p-2 text-left">Dirección</th>
                                        <th class="border border-surface-500 p-2 text-left">Tipo de Dato</th>
                                        <th class="border border-surface-500 p-2 text-left">Valor por Defecto</th>
                                        <th class="border border-surface-500 p-2 text-left">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let param of procedureParameters" class="hover:bg-surface-200">
                                        <td class="border border-surface-500 p-2 font-mono">{{ param.name }}</td>
                                        <td class="border border-surface-500 p-2">
                                            <p-chip
                                                [label]="param.direction"
                                                [styleClass]="param.direction === 'IN' ? 'bg-green-600' : param.direction === 'OUT' ? 'bg-blue-600' : 'bg-purple-600'"
                                                [pTooltip]="param.direction === 'IN' ? 'Parámetro de entrada' : param.direction === 'OUT' ? 'Parámetro de salida' : 'Parámetro de entrada/salida'"
                                            >
                                            </p-chip>
                                        </td>
                                        <td class="border border-surface-500 p-2 font-mono text-sm">{{ param.type }}</td>
                                        <td class="border border-surface-500 p-2">
                                            <span *ngIf="param.defaultValue">{{ param.defaultValue }}</span>
                                            <span *ngIf="!param.defaultValue" class="text-gray-500 italic">Ninguno</span>
                                        </td>
                                        <td class="border border-surface-500 p-2">{{ param.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <ng-template #noParameters>
                            <p class="text-gray-400 italic">Este procedimiento no tiene parámetros.</p>
                        </ng-template>
                    </div>

                    <!-- Operaciones en Tablas -->
                    <div *ngIf="procedureTableOperations && procedureTableOperations.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Operaciones en Tablas:</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                *ngFor="let op of procedureTableOperations"
                                class="bg-surface-700 p-4 rounded-lg border-l-4"
                                [ngClass]="{
                                    'border-green-500': op.operation === 'INSERT',
                                    'border-blue-500': op.operation === 'SELECT',
                                    'border-orange-500': op.operation === 'UPDATE',
                                    'border-red-500': op.operation === 'DELETE'
                                }"
                            >
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="font-semibold text-slate-200">{{ op.tableName }}</span>
                                    <p-chip [label]="op.operation" [styleClass]="op.operation === 'INSERT' ? 'bg-green-600' : op.operation === 'SELECT' ? 'bg-blue-600' : op.operation === 'UPDATE' ? 'bg-orange-600' : 'bg-red-600'"> </p-chip>
                                </div>
                                <p class="text-sm text-slate-300">{{ op.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Información de Transacción -->
                    <div *ngIf="procedureTransactionInfo" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Información de Transacción:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <div class="flex items-center gap-2 mb-3">
                                <p-chip label="Transaccional" *ngIf="procedureTransactionInfo.hasTransaction" styleClass="bg-green-600"></p-chip>
                                <p-chip label="No Transaccional" *ngIf="!procedureTransactionInfo.hasTransaction" styleClass="bg-gray-600"></p-chip>
                                <p-chip *ngIf="procedureTransactionInfo.hasTransaction" [label]="procedureTransactionInfo.transactionLevel" styleClass="bg-blue-600"></p-chip>
                            </div>
                            <div *ngIf="procedureTransactionInfo.hasTransaction">
                                <h5 class="text-md font-medium text-gray-300 mb-1">Manejo de Errores:</h5>
                                <p class="text-sm whitespace-pre-line text-slate-200">{{ procedureTransactionInfo.errorHandling }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Notas de Implementación -->
                    <div *ngIf="procedureImplementationNotes" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Notas de Implementación:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <p class="text-slate-300 whitespace-pre-line">{{ procedureImplementationNotes }}</p>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Código SQL -->
                <p-tabPanel header="Código SQL">
                    <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>

                <!-- Ejemplos de uso -->
                <p-tabPanel header="Ejemplos de Uso" *ngIf="procedureExampleUsages && procedureExampleUsages.length > 0">
                    <div *ngFor="let example of procedureExampleUsages; let i = index" class="mb-6">
                        <h3 class="text-md font-medium text-slate-200 mb-2">{{ example.description }}</h3>
                        <app-code-card language="sql" [code]="example.sql" (copy)="onCopy(example.sql)"></app-code-card>
                        <div *ngIf="example.result" class="mt-3">
                            <h4 class="text-sm font-medium text-slate-200 mb-1">Resultado:</h4>
                            <div class="bg-surface-700 p-3 rounded">
                                <pre class="text-xs overflow-x-auto text-slate-200">{{ example.result }}</pre>
                            </div>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Diagrama de Flujo -->
                <p-tabPanel header="Diagrama de Flujo" *ngIf="flowDiagramUrl">
                    <div class="flex justify-center bg-surface-700 p-4 rounded-lg">
                        <img [src]="flowDiagramUrl" alt="Diagrama de flujo del procedimiento" class="max-w-full h-auto" />
                    </div>
                    <p class="text-sm text-center text-gray-400 mt-2">{{ flowDiagramDescription }}</p>
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
export class ProcedureSectionComponent {
    @Input() procedureName = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() parameters: ProcedureParameter[] = [];
    @Input() tableOperations: ProcedureTableOperation[] = [];
    @Input() transactionInfo?: ProcedureTransactionInfo;
    @Input() implementationNotes = '';
    @Input() exampleUsages: { description: string; sql: string; result?: string }[] = [];
    @Input() flowDiagramUrl = '';
    @Input() flowDiagramDescription = '';
    @Input() procedureDetail?: ProcedureDetail;

    constructor(private messageService: MessageService) {}

    // Getters para acceder a las propiedades del detalle del procedimiento si está disponible
    get getProcedureName(): string {
        return this.procedureDetail?.name || this.procedureName;
    }

    get procedureDescription(): string {
        return this.procedureDetail?.description || this.description;
    }

    get procedureParameters(): ProcedureParameter[] {
        return this.procedureDetail?.parameters || this.parameters;
    }

    get procedureTableOperations(): any[] {
        return this.procedureDetail?.tableOperations || this.tableOperations;
    }

    get procedureTransactionInfo(): any {
        if (this.procedureDetail?.transactionInfo) {
            return {
                hasTransaction: this.procedureDetail.transactionInfo.usesTransaction,
                transactionLevel: this.procedureDetail.transactionInfo.isolationLevel,
                errorHandling: this.procedureDetail.transactionInfo.rollbackConditions?.join('\n')
            };
        }
        return this.transactionInfo;
    }

    get procedureImplementationNotes(): string {
        return this.procedureDetail?.errorHandling?.strategy || this.implementationNotes;
    }

    get procedureExampleUsages(): { description: string; sql: string; result?: string }[] {
        return this.procedureDetail?.exampleUsages || this.exampleUsages;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
