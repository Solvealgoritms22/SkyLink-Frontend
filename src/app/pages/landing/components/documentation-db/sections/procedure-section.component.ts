import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-procedure-section',
  standalone: true,
  imports: [CommonModule, CodeCardComponent],
  template: `
    <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
      <h2 class="text-primary text-2xl font-semibold mb-4">
        Procedimiento:
        <span class="text-sm px-2 py-1 rounded-md font-mono bg-purple-400/10 text-purple-400">{{ procedureName }}</span>
      </h2>
      <p class="text-slate-300 mb-4">{{ description }}</p>
      <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
    </section>
  `
})
export class ProcedureSectionComponent {
  @Input() procedureName = '';
  @Input() description = '';
  @Input() sqlCode = '';

  constructor(private messageService: MessageService) {}

  onCopy(txt: string) {
    navigator.clipboard.writeText(txt).then(() =>
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
  }
}
