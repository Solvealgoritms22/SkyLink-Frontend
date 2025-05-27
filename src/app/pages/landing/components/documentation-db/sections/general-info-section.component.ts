import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-general-info-section',
  standalone: true,
  imports: [CommonModule, CodeCardComponent],
  template: `
    <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-primary text-2xl font-semibold mb-4">{{ title }}</h2>
      <p class="text-slate-300 mb-6">{{ description }}</p>
      <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
    </section>
  `
})
export class GeneralInfoSectionComponent {
  @Input() title = 'Sistema de Reservas de Aerolíneas';
  @Input() description = 'Documentación detallada del esquema SQL para un sistema completo de reservas de aerolíneas, incluyendo tablas, funciones, procedimientos almacenados, triggers, vistas, eventos y configuración de seguridad.';
  @Input() sqlCode = '';

  constructor(private messageService: MessageService) {}

  onCopy(txt: string) {
    navigator.clipboard.writeText(txt).then(() =>
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
  }
}
