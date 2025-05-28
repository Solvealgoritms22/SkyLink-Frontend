import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { EventDetail } from '../models/event-details.model';

interface EventSchedule {
  type: 'ONE TIME' | 'RECURRING';
  schedule: string;
  startDate?: string;
  endDate?: string;
}

interface EventExecutionHistory {
  date: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  duration: string;
  details?: string;
}

@Component({
  selector: 'app-event-section',
  standalone: true,
  imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule, TimelineModule],
  template: `
    <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">      <h2 class="text-primary text-2xl font-semibold mb-4">
        Evento:
        <span class="text-sm px-2 py-1 rounded-md font-mono bg-orange-400/10 text-orange-400">{{ getEventName }}</span>
      </h2>
      <p class="text-slate-300 mb-4">{{ eventDescription }}</p>

      <p-tabView styleClass="custom-tabview">
        <!-- Detalles del evento -->
        <p-tabPanel header="Detalles">
          <!-- Programación -->
          <div class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Programación:</h4>
            <div class="bg-surface-700 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">                <div>
                  <p class="text-md font-medium text-gray-300">Tipo:</p>
                  <p-chip 
                    [label]="eventSchedule.type" 
                    [styleClass]="eventSchedule.type === 'ONE TIME' ? 'bg-purple-600' : 'bg-blue-600'">
                  </p-chip>
                </div>
                <div>
                  <p class="text-md font-medium text-gray-300">Expresión de Programación:</p>
                  <p class="text-lg font-mono">{{ eventSchedule.schedule }}</p>
                </div>
                <div *ngIf="eventSchedule.startDate">
                  <p class="text-md font-medium text-gray-300">Fecha de Inicio:</p>
                  <p class="text-lg">{{ eventSchedule.startDate }}</p>
                </div>
                <div *ngIf="eventSchedule.endDate">
                  <p class="text-md font-medium text-gray-300">Fecha de Fin:</p>
                  <p class="text-lg">{{ eventSchedule.endDate }}</p>
                </div>
              </div>              <div *ngIf="eventScheduleDescription" class="mt-4">
                <p class="text-md font-medium text-gray-300">Descripción:</p>
                <p class="text-slate-300">{{ eventScheduleDescription }}</p>
              </div>
            </div>
          </div>          <!-- Funcionalidad -->
          <div class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Funcionalidad:</h4>
            <div class="bg-surface-700 p-4 rounded-lg">
              <p class="text-slate-300 whitespace-pre-line">{{ eventFunctionality }}</p>
            </div>
          </div>          <!-- Tablas Afectadas -->
          <div *ngIf="eventAffectedTables && eventAffectedTables.length > 0" class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Tablas Afectadas:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let table of eventAffectedTables" class="bg-surface-700 p-4 rounded-lg border-l-4"
                [ngClass]="{
                  'border-green-500': table.operation === 'INSERT',
                  'border-blue-500': table.operation === 'SELECT',
                  'border-orange-500': table.operation === 'UPDATE',
                  'border-red-500': table.operation === 'DELETE'
                }">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-semibold">{{ table.name }}</span>
                  <p-chip 
                    [label]="table.operation" 
                    [styleClass]="table.operation === 'INSERT' ? 'bg-green-600' : 
                                table.operation === 'SELECT' ? 'bg-blue-600' : 
                                table.operation === 'UPDATE' ? 'bg-orange-600' : 'bg-red-600'">
                  </p-chip>
                </div>
                <p class="text-sm text-slate-300">{{ table.description }}</p>
              </div>
            </div>
          </div>          <!-- Requisitos de Preservación -->
          <div *ngIf="eventPreservationRequirements" class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Requisitos de Preservación:</h4>
            <div class="bg-surface-700 p-4 rounded-lg">
              <p class="text-slate-300 whitespace-pre-line">{{ eventPreservationRequirements }}</p>
            </div>
          </div>          <!-- Notas de Mantenimiento -->
          <div *ngIf="eventMaintenanceNotes" class="mb-6">
            <h4 class="text-xl font-medium text-secondary-400 mb-3">Notas de Mantenimiento:</h4>
            <div class="bg-surface-700 p-4 rounded-lg">
              <p class="text-slate-300 whitespace-pre-line">{{ eventMaintenanceNotes }}</p>
            </div>
          </div>
        </p-tabPanel>

        <!-- Código SQL -->
        <p-tabPanel header="Código SQL">
          <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
        </p-tabPanel>        <!-- Historial de Ejecución -->
        <p-tabPanel header="Historial de Ejecución" *ngIf="eventExecutionHistory && eventExecutionHistory.length > 0">
          <p-timeline [value]="eventExecutionHistory">
            <ng-template pTemplate="content" let-event>
              <div class="bg-surface-700 p-4 rounded-lg mb-3">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-medium">{{ event.date }}</p>
                  <p-chip 
                    [label]="event.status" 
                    [styleClass]="event.status === 'SUCCESS' ? 'bg-green-600' : 
                                event.status === 'FAILED' ? 'bg-red-600' : 'bg-gray-600'">
                  </p-chip>
                </div>
                <p class="text-sm text-slate-300 mb-2">Duración: {{ event.duration }}</p>
                <p *ngIf="event.details" class="text-sm text-slate-400">{{ event.details }}</p>
              </div>
            </ng-template>
            <ng-template pTemplate="opposite" let-event>
              <div class="flex items-center justify-end">
                <span class="text-xs px-2 py-1 rounded-full"
                     [ngClass]="{
                       'bg-green-900/30 text-green-400': event.status === 'SUCCESS',
                       'bg-red-900/30 text-red-400': event.status === 'FAILED',
                       'bg-gray-900/30 text-gray-400': event.status === 'SKIPPED'
                     }">
                  {{ event.status === 'SUCCESS' ? '✓' : event.status === 'FAILED' ? '✗' : '-' }}
                </span>
              </div>
            </ng-template>
          </p-timeline>
        </p-tabPanel>
      </p-tabView>
    </section>
  `,
  styles: [`
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
    :host ::ng-deep .p-timeline-event-opposite {
      flex: 0;
      padding: 0 1rem;
    }
    :host ::ng-deep .p-timeline-event-content {
      flex: 1;
    }
  `]
})
export class EventSectionComponent {
  @Input() eventName = '';
  @Input() description = '';
  @Input() sqlCode = '';
  @Input() schedule: EventSchedule = {
    type: 'RECURRING',
    schedule: ''
  };
  @Input() scheduleDescription = '';
  @Input() functionality = '';
  @Input() affectedTables: {name: string, operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT', description: string}[] = [];
  @Input() preservationRequirements = '';  
  @Input() maintenanceNotes = '';
  @Input() executionHistory: EventExecutionHistory[] = [];
  @Input() eventDetail?: EventDetail;

  constructor(private messageService: MessageService) {}

  // Getters para acceder a las propiedades del detalle del evento si está disponible
  get getEventName(): string {
    return this.eventDetail?.name || this.eventName;
  }
  
  get eventDescription(): string {
    return this.eventDetail?.description || this.description;
  }
  
  get eventSchedule(): any {
    if (this.eventDetail?.schedule) {
      const schedule = this.eventDetail.schedule;
      let scheduleStr = '';
      
      if (schedule.interval) {
        scheduleStr = `Cada ${schedule.interval.value} ${schedule.interval.unit.toLowerCase()}(s)`;
      }
      
      return {
        type: schedule.type,
        schedule: scheduleStr,
        startDate: schedule.startTime,
        endDate: schedule.endTime
      };
    }
    return this.schedule;
  }
  
  get eventScheduleDescription(): string {
    if (this.eventDetail?.schedule) {
      const schedule = this.eventDetail.schedule;
      if (schedule.type === 'ONE TIME') {
        return `Ejecución única a las ${schedule.specificTime || 'hora programada'}`;
      } else {
        return `Se ejecuta cada ${schedule.interval?.value} ${schedule.interval?.unit.toLowerCase()}(s)${schedule.startTime ? ' desde ' + schedule.startTime : ''}${schedule.endTime ? ' hasta ' + schedule.endTime : ''}`;
      }
    }
    return this.scheduleDescription;
  }
  
  get eventFunctionality(): string {
    return this.eventDetail?.businessImpact || this.functionality;
  }
  
  get eventAffectedTables(): any[] {
    return this.eventDetail?.affectedTables || this.affectedTables;
  }
  
  get eventPreservationRequirements(): string {
    if (this.eventDetail?.preservationPolicy) {
      let requirements = `Retención de datos: ${this.eventDetail.preservationPolicy.dataRetention}`;
      if (this.eventDetail.preservationPolicy.archiving) {
        requirements += `\nArchivado: Sí${this.eventDetail.preservationPolicy.archiveDestination ? ', Destino: ' + this.eventDetail.preservationPolicy.archiveDestination : ''}`;
      } else {
        requirements += '\nArchivado: No';
      }
      return requirements;
    }
    return this.preservationRequirements;
  }
  
  get eventMaintenanceNotes(): string {
    if (this.eventDetail?.maintenanceNotes) {
      return this.eventDetail.maintenanceNotes.join('\n\n');
    }
    return this.maintenanceNotes;
  }
  
  get eventExecutionHistory(): EventExecutionHistory[] {
    if (this.eventDetail?.executionHistory) {
      return this.eventDetail.executionHistory.map(history => ({
        date: history.date,
        status: history.status === 'SUCCESS' ? 'SUCCESS' : 
               history.status === 'FAILURE' ? 'FAILED' : 'SKIPPED',
        duration: history.duration || '',
        details: history.error || `Registros procesados: ${history.recordsProcessed || 'N/A'}`
      }));
    }
    return this.executionHistory;
  }
  
  get eventPerformanceConsiderations(): string[] {
    return this.eventDetail?.performanceConsiderations || [];
  }

  onCopy(txt: string) {
    navigator.clipboard.writeText(txt).then(() =>
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
  }
}
