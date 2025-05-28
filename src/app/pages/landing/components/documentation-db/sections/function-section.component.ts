import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { FunctionDetail } from '../models/function-details.model';

interface FunctionParameter {
    name: string;
    type: string;
    description: string;
    defaultValue?: string;
}

interface FunctionRelatedTable {
    tableName: string;
    relationship: string;
    description: string;
}

@Component({
    selector: 'app-function-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">
                Función:
                <span class="text-sm px-2 py-1 rounded-md font-mono bg-green-400/10 text-green-400">{{ functionName }}</span>
            </h2>
            <p class="text-slate-300 mb-4">{{ functionDescription }}</p>

            <p-tabView styleClass="custom-tabview">
                <!-- Detalles de la función -->
                <p-tabPanel header="Detalles">
                    <div class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Parámetros:</h4>
                        <div *ngIf="functionParameters && functionParameters.length > 0; else noParameters" class="overflow-x-auto rounded-md shadow">
                            <table class="w-full border-collapse table-auto">
                                <thead class="bg-surface-600 text-slate-200">
                                    <tr>
                                        <th class="border border-surface-500 p-2 text-left">Nombre</th>
                                        <th class="border border-surface-500 p-2 text-left">Tipo de Dato</th>
                                        <th class="border border-surface-500 p-2 text-left">Valor por Defecto</th>
                                        <th class="border border-surface-500 p-2 text-left">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let param of functionParameters" class="hover:bg-surface-700 text-slate-300">
                                        <td class="border border-surface-500 p-2 font-mono">{{ param.name }}</td>
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
                            <p class="text-gray-400 italic">Esta función no tiene parámetros.</p>
                        </ng-template>
                    </div>
                    <div class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Tipo de Retorno:</h4>
                        <div class="bg-surface-700 p-3 rounded">
                            <p class="font-mono text-slate-200">{{ functionReturnType }}</p>
                            <p *ngIf="functionReturnTypeDescription" class="text-sm text-gray-300 mt-2">{{ functionReturnTypeDescription }}</p>
                        </div>
                    </div>

                    <!-- Tablas relacionadas -->
                    <div *ngIf="functionRelatedTables && functionRelatedTables.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Tablas Relacionadas:</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div *ngFor="let table of functionRelatedTables" class="bg-surface-700 p-4 rounded-lg border-l-4 border-blue-500">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="font-semibold">{{ table.tableName }}</span>
                                    <span class="text-xs px-2 py-1 rounded bg-surface-600">{{ table.relationship }}</span>
                                </div>
                                <p class="text-sm text-slate-300">{{ table.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Detalles de implementación -->
                    <div *ngIf="implementationNotes" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Notas de Implementación:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <p class="text-slate-300 whitespace-pre-line">{{ implementationNotes }}</p>
                        </div>
                    </div>

                    <!-- Casos de uso -->
                    <div *ngIf="useCases && useCases.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-2">Casos de Uso:</h4>
                        <ul class="list-disc list-inside pl-4">
                            <li *ngFor="let useCase of useCases" class="mb-2 text-slate-300">{{ useCase }}</li>
                        </ul>
                    </div>
                </p-tabPanel>

                <!-- Código SQL -->
                <p-tabPanel header="Código SQL">
                    <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>

                <!-- Ejemplos de uso -->
                <p-tabPanel header="Ejemplos de Uso" *ngIf="exampleUsages && exampleUsages.length > 0">
                    <div *ngFor="let example of exampleUsages; let i = index" class="mb-6">
                        <h3 class="text-md font-medium text-secondary-300 mb-2">{{ example.description }}</h3>
                        <app-code-card language="sql" [code]="example.sql" (copy)="onCopy(example.sql)"></app-code-card>
                        <div *ngIf="example.result" class="mt-2">
                            <h4 class="text-sm font-medium text-secondary-300">Resultado:</h4>
                            <div class="bg-surface-700 p-3 rounded mt-1">
                                <pre class="text-xs overflow-x-auto">{{ example.result }}</pre>
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
            :host ::ng-deep .p-tablist-tab-list {
                background: var(--surface-700);
            }
        `
    ]
})
export class FunctionSectionComponent {
    @Input() name = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() parameters: FunctionParameter[] = [];
    @Input() returnType = '';
    @Input() returnTypeDescription = '';
    @Input() relatedTables: FunctionRelatedTable[] = [];
    @Input() implementationNotes = '';
    @Input() useCases: string[] = [];
    @Input() exampleUsages: { description: string; sql: string; result?: string }[] = [];
    @Input() functionDetail?: FunctionDetail;

    constructor(private messageService: MessageService) {}

    // Getters para acceder a las propiedades del detalle de la función si está disponible
    get functionName(): string {
        return this.functionDetail?.name || this.name;
    }

    get functionDescription(): string {
        return this.functionDetail?.description || this.description;
    }

    get functionParameters(): FunctionParameter[] {
        return this.functionDetail?.parameters || this.parameters;
    }

    get functionReturnType(): string {
        return this.functionDetail?.returnType || this.returnType;
    }

    get functionReturnTypeDescription(): string {
        return this.functionDetail?.returnTypeDescription || this.returnTypeDescription;
    }

    get functionRelatedTables(): any[] {
        return this.functionDetail?.relatedTables || this.relatedTables;
    }

    get functionImplementationNotes(): string {
        return this.functionDetail?.implementationNotes || this.implementationNotes;
    }

    get functionUseCases(): string[] {
        return this.functionDetail?.useCases || this.useCases;
    }

    get functionExampleUsages(): { description: string; sql: string; result?: string }[] {
        return this.functionDetail?.exampleUsages || this.exampleUsages;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
