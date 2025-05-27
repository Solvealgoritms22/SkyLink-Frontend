import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TriggerDetail as TriggerDetailModel } from '../models/trigger-details.model';

interface TriggerTableOperation {
    tableName: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
    description: string;
}

interface TriggerVariable {
    name: string;
    description: string;
    usage: string;
}

@Component({
    selector: 'app-trigger-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">
                Trigger:
                <span class="text-sm px-2 py-1 rounded-md font-mono bg-orange-400/10 text-orange-500">{{ getTriggerName }}</span>
            </h2>
            <p class="text-slate-300 mb-4">{{ triggerDescription }}</p>

            <p-tabView styleClass="custom-tabview">
                <!-- Detalles del Trigger -->
                <p-tabPanel header="Detalles">
                    <!-- Información básica -->
                    <div class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Información Básica:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p class="text-md font-medium text-gray-300">Tabla:</p>
                                    <p class="text-lg font-mono text-slate-200">{{ triggerDetailsInfo.table }}</p>
                                </div>
                                <div>
                                    <p class="text-md font-medium text-gray-300">Temporización:</p>
                                    <p-chip [label]="triggerDetailsInfo.timing" [styleClass]="triggerDetailsInfo.timing === 'BEFORE' ? 'bg-purple-600' : 'bg-blue-600'"> </p-chip>
                                </div>
                                <div>
                                    <p class="text-md font-medium text-gray-300">Evento:</p>
                                    <p-chip [label]="triggerDetailsInfo.event" [styleClass]="triggerDetailsInfo.event === 'INSERT' ? 'bg-green-600' : triggerDetailsInfo.event === 'UPDATE' ? 'bg-orange-600' : 'bg-red-600'"> </p-chip>
                                </div>
                                <div>
                                    <p class="text-md font-medium text-gray-300">Alcance:</p>
                                    <p-chip [label]="triggerDetailsInfo.perRow ? 'Por Fila (FOR EACH ROW)' : 'Por Sentencia'" styleClass="bg-gray-600"> </p-chip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Variables Especiales -->
                    <div *ngIf="triggerSpecialVariables && triggerSpecialVariables.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Variables Especiales:</h4>
                        <div class="overflow-x-auto rounded-md shadow">
                            <table class="w-full border-collapse table-auto">
                                <thead class="bg-surface-600 text-slate-200">
                                    <tr>
                                        <th class="border border-surface-500 p-2 text-left">Nombre</th>
                                        <th class="border border-surface-500 p-2 text-left">Descripción</th>
                                        <th class="border border-surface-500 p-2 text-left">Uso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let variable of triggerSpecialVariables" class="hover:bg-surface-700">
                                        <td class="border border-surface-500 p-2 font-mono">{{ variable.name }}</td>
                                        <td class="border border-surface-500 p-2">{{ variable.description }}</td>
                                        <td class="border border-surface-500 p-2 font-mono">{{ variable.usage }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Operaciones en Tablas -->
                    <div *ngIf="triggerTableOps && triggerTableOps.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Operaciones en Tablas:</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                *ngFor="let op of triggerTableOps"
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
                    <!-- Casos de Uso -->
                    <div *ngIf="triggerUseCases && triggerUseCases.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Casos de Uso:</h4>
                        <ul class="list-disc list-inside pl-4">
                            <li *ngFor="let useCase of triggerUseCases" class="mb-2 text-slate-300">{{ useCase }}</li>
                        </ul>
                    </div>

                    <!-- Notas de Implementación -->
                    <div *ngIf="triggerImplementationNotes" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Notas de Implementación:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <p class="text-slate-300 whitespace-pre-line">{{ triggerImplementationNotes }}</p>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Código SQL -->
                <p-tabPanel header="Código SQL">
                    <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>

                <!-- Ejemplos -->
                <p-tabPanel header="Ejemplos" *ngIf="triggerExamples && triggerExamples.length > 0">
                    <div *ngFor="let example of triggerExamples; let i = index" class="mb-6">
                        <h3 class="text-md font-medium text-slate-200 mb-2">{{ example.description }}</h3>
                        <div class="bg-surface-700 p-4 rounded-lg mb-3">
                            <h4 class="text-sm font-medium text-slate-200 mb-2">Operación que activa el trigger:</h4>
                            <app-code-card language="sql" [code]="example.triggeringSql" (copy)="onCopy(example.triggeringSql)"></app-code-card>
                        </div>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-slate-200 mb-2">Resultado:</h4>
                            <pre class="text-xs overflow-x-auto text-slate-200">{{ example.result }}</pre>
                        </div>
                    </div>
                </p-tabPanel>
                <!-- Diagrama -->
                <p-tabPanel header="Diagrama de Flujo" *ngIf="triggerDiagramUrl">
                    <div class="flex justify-center bg-surface-700 p-4 rounded-lg">
                        <img [src]="triggerDiagramUrl" alt="Diagrama de flujo del trigger" class="max-w-full h-auto" />
                    </div>
                    <p *ngIf="triggerDiagramDescription" class="text-sm text-center text-gray-400 mt-2">{{ triggerDiagramDescription }}</p>
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
export class TriggerSectionComponent {
    @Input() triggerName = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() triggerDetails = {
        table: '',
        timing: 'AFTER',
        event: 'INSERT',
        perRow: true
    };
    @Input() triggerVariables: TriggerVariable[] = [];
    @Input() tableOperations: TriggerTableOperation[] = [];
    @Input() useCases: string[] = [];
    @Input() implementationNotes = '';
    @Input() examples: { description: string; triggeringSql: string; result: string }[] = [];
    @Input() diagramUrl = '';
    @Input() diagramDescription = '';
    @Input() triggerDetail?: TriggerDetailModel;

    constructor(private messageService: MessageService) {}

    // Getters for accessing properties from triggerDetail if available
    get getTriggerName(): string {
        return this.triggerDetail?.name || this.triggerName;
    }

    get triggerDescription(): string {
        return this.triggerDetail?.description || this.description;
    }

    get triggerDetailsInfo(): any {
        if (this.triggerDetail) {
            return {
                table: this.triggerDetail.tableName,
                timing: this.triggerDetail.triggerTiming,
                event: this.triggerDetail.triggerEvent,
                perRow: true // Assuming all triggers are FOR EACH ROW by default
            };
        }
        return this.triggerDetails;
    }

    get triggerSpecialVariables(): TriggerVariable[] {
        if (this.triggerDetail?.specialVariables) {
            return this.triggerDetail.specialVariables.map((v) => ({
                name: v.name,
                description: v.description,
                usage: v.example || ''
            }));
        }
        return this.triggerVariables;
    }

    get triggerTableOps(): TriggerTableOperation[] {
        if (this.triggerDetail?.affectedTables) {
            const operations: TriggerTableOperation[] = [];
            this.triggerDetail.affectedTables.forEach((table) => {
                // For simplicity, assuming all affected tables have INSERT operations
                // In a real implementation, you might want to determine the operation type more precisely
                operations.push({
                    tableName: table.name,
                    operation: 'INSERT', // This is a simplification
                    description: `Affects columns: ${table.columns.map((c) => c.name).join(', ')}`
                });
            });
            return operations;
        }
        return this.tableOperations;
    }

    get triggerUseCases(): string[] {
        return this.triggerDetail?.businessRules || this.useCases;
    }

    get triggerImplementationNotes(): string {
        // Assuming implementation notes would be derived from business rules or other fields
        if (this.triggerDetail?.businessRules) {
            return this.triggerDetail.businessRules.join('\n\n');
        }
        return this.implementationNotes;
    }

    get triggerExamples(): { description: string; triggeringSql: string; result: string }[] {
        if (this.triggerDetail?.exampleTriggeringOperations) {
            return this.triggerDetail.exampleTriggeringOperations.map((ex) => ({
                description: ex.description,
                triggeringSql: ex.sql,
                result: ex.effect
            }));
        }
        return this.examples;
    }

    get triggerDiagramUrl(): string {
        // In a real implementation, you might want to generate or retrieve diagram URLs
        return this.diagramUrl;
    }
    get triggerDiagramDescription(): string {
        if (this.triggerDetail?.flowDiagram) {
            return `Flujo de ejecución en ${this.triggerDetail.flowDiagram.steps?.length || 0} pasos`;
        }
        return this.diagramDescription;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
