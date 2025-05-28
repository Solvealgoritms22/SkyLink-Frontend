import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ViewDetail } from '../models/view-details.model';

interface ViewColumn {
  name: string;
  type: string;
  description: string;
  sourceTable?: string;
  sourceColumn?: string;
}

interface ViewSourceTable {
  name: string;
  joinType?: 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL JOIN';
  joinCondition?: string;
  description: string;
}

@Component({
  selector: 'app-view-section',
  standalone: true,
  imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule],
  template: `
    <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">      <h2 class="text-primary text-2xl font-semibold mb-4">
        Vista:
        <span class="text-sm px-2 py-1 rounded-md font-mono bg-purple-400/10 text-purple-400">{{ getViewName }}</span>
      </h2>
      <p class="text-slate-300 mb-4">{{ viewDescription }}</p>

      <p-tabView styleClass="custom-tabview">
        <!-- Detalles de la vista -->
        <p-tabPanel header="Estructura">
          <!-- Columnas de la vista -->
          <div class="mb-6 bg-surface-800 p-4 rounded-lg shadow text-slate-200">
            <h4 class="text-xl font-medium text-slate-200 mb-3">Columnas:</h4>
            <div class="overflow-x-auto rounded-md shadow">
              <table class="w-full border-collapse table-auto">
                <thead class="bg-surface-600">
                  <tr>
                    <th class="border border-surface-500 p-2 text-left">Nombre</th>
                    <th class="border border-surface-500 p-2 text-left">Tipo de Dato</th>
                    <th class="border border-surface-500 p-2 text-left">Origen</th>
                    <th class="border border-surface-500 p-2 text-left">Descripción</th>
                  </tr>
                </thead>                <tbody>
                  <tr *ngFor="let column of viewColumns" class="hover:bg-surface-700">
                    <td class="border border-surface-500 p-2 font-mono">{{ column.name }}</td>
                    <td class="border border-surface-500 p-2 font-mono text-sm">{{ column.type }}</td>
                    <td class="border border-surface-500 p-2">
                      <span *ngIf="column.sourceTable && column.sourceColumn" class="font-mono text-xs">
                        {{ column.sourceTable }}.{{ column.sourceColumn }}
                      </span>
                      <span *ngIf="!column.sourceTable || !column.sourceColumn" class="text-gray-500 italic">
                        Expresión calculada
                      </span>
                    </td>
                    <td class="border border-surface-500 p-2">{{ column.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>          <!-- Tablas fuente -->
          <div *ngIf="viewSourceTables && viewSourceTables.length > 0" class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Tablas Fuente:</h4>
            <div *ngFor="let table of viewSourceTables; let i = index" class="mb-3 bg-surface-700 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-semibold font-mono">{{ table.name }}</span>
                <p-chip *ngIf="table.joinType" [label]="table.joinType" styleClass="bg-blue-600"></p-chip>
              </div>
              <p class="text-sm text-slate-300 mb-2">{{ table.description }}</p>
              <div *ngIf="table.joinCondition" class="bg-surface-600 p-2 rounded mt-1">
                <p class="text-xs font-mono">{{ table.joinCondition }}</p>
              </div>
            </div>
          </div>
            <!-- Filtros aplicados -->
          <div *ngIf="viewFilterConditions && viewFilterConditions.length > 0" class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Filtros Aplicados:</h4>
            <div *ngFor="let filter of viewFilterConditions; let i = index" class="mb-2">
              <div class="bg-surface-700 p-3 rounded">
                <p class="font-mono text-sm">{{ filter }}</p>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Código SQL -->
        <p-tabPanel header="Código SQL">
          <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
        </p-tabPanel>        <!-- Ejemplos de consulta -->
        <p-tabPanel header="Ejemplos de Consultas" *ngIf="viewExampleQueries && viewExampleQueries.length > 0">
          <div *ngFor="let query of viewExampleQueries; let i = index" class="mb-6">
            <h3 class="text-md font-medium text-secondary-300 mb-2">{{ query.description }}</h3>
            <app-code-card language="sql" [code]="query.sql" (copy)="onCopy(query.sql)"></app-code-card>
            <div *ngIf="query.result" class="mt-3">
              <h4 class="text-sm font-medium text-secondary-300 mb-1">Resultado:</h4>
              <div class="bg-surface-700 p-3 rounded">
                <pre class="text-xs text-slate-200 overflow-x-auto">{{ query.result }}</pre>
              </div>
            </div>
          </div>
        </p-tabPanel>        <!-- Notas de rendimiento -->
        <p-tabPanel header="Rendimiento" *ngIf="viewPerformanceNotes">
          <div class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-2">Consideraciones de Rendimiento:</h4>
            <div class="bg-surface-700 p-4 rounded-lg">
              <p class="text-slate-300 whitespace-pre-line">{{ viewPerformanceNotes }}</p>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </section>
  `,
  styles: [`
    :host ::ng-deep .custom-tabview .p-tabview-nav {
      background: var(--surface-800);
      border-color: var(--surface-800);
    }
    :host ::ng-deep .custom-tabview .p-tabview-nav li .p-tabview-nav-link {
      color: var(--text-color);
      background: var(--surface-800);
    }
    :host ::ng-deep .custom-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  `]
})
export class ViewSectionComponent {
  @Input() viewName = '';
  @Input() description = '';
  @Input() sqlCode = '';
  @Input() columns: ViewColumn[] = [];
  @Input() sourceTables: ViewSourceTable[] = [];
  @Input() filterConditions: string[] = [];  
  @Input() exampleQueries: {description: string, sql: string, result?: string}[] = [];
  @Input() performanceNotes = '';
  @Input() viewDetail?: ViewDetail;

  constructor(private messageService: MessageService) {}

  // Getters para acceder a las propiedades del detalle de la vista si está disponible
  get getViewName(): string {
    return this.viewDetail?.name || this.viewName;
  }
  
  get viewDescription(): string {
    return this.viewDetail?.description || this.description;
  }
  
  get viewColumns(): ViewColumn[] {
    return this.viewDetail?.columns || this.columns;
  }
  
  get viewSourceTables(): ViewSourceTable[] {
    return this.viewDetail?.sourceTables || this.sourceTables;
  }
  
  get viewFilterConditions(): string[] {
    if (this.viewDetail?.whereConditions) {
      return [this.viewDetail.whereConditions];
    }
    return this.filterConditions;
  }
  
  get viewExampleQueries(): {description: string, sql: string, result?: string}[] {
    return this.viewDetail?.exampleQueries || this.exampleQueries;
  }
  
  get viewPerformanceNotes(): string {
    return this.viewDetail?.performanceNotes || this.performanceNotes;
  }

  onCopy(txt: string) {
    navigator.clipboard.writeText(txt).then(() =>
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
  }
}
