import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeCardComponent } from '../code-card.component';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { SecurityDetail } from '../models/security-details.model';

interface SecurityUser {
    username: string;
    description: string;
    roles: string[];
    username: string;
    description: string;
    roles: string[];
}

interface SecurityRole {
    name: string;
    description: string;
    permissions: {
        table: string;
        privileges: ('SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'ALL')[];
    }[];
    name: string;
    description: string;
    permissions: {
        table: string;
        privileges: ('SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'EXECUTE' | 'ALL')[];
    }[];
}

interface SecurityAuditPolicy {
    name: string;
    description: string;
    tables: string[];
    auditedActions: string[];
    name: string;
    description: string;
    tables: string[];
    auditedActions: string[];
}

@Component({
    selector: 'app-security-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule, AccordionModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">Seguridad</h2>
            <p class="text-slate-300 mb-4">{{ securityDescription }}</p>
    selector: 'app-security-section',
    standalone: true,
    imports: [CommonModule, CodeCardComponent, TabViewModule, DividerModule, TooltipModule, CardModule, ChipModule, AccordionModule],
    template: `
        <section class="mb-12 bg-surface-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-primary text-2xl font-semibold mb-4">Seguridad</h2>
            <p class="text-slate-300 mb-4">{{ securityDescription }}</p>

            <p-tabView styleClass="custom-tabview" scrollable>
                <!-- Información general -->
                <p-tabPanel header="Información General">
                    <!-- Usuarios -->
                    <div *ngIf="securityUsers && securityUsers.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Usuarios del Sistema:</h4>
                        <div *ngFor="let user of securityUsers" class="mb-3 bg-surface-700 p-4 rounded-lg">
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h5 class="text-lg font-semibold font-mono text-slate-300">{{ user.username }}</h5>
                                <div class="flex flex-wrap gap-1">
                                    <p-chip *ngFor="let role of user.roles" [label]="role" styleClass="bg-blue-600 text-xs"></p-chip>
                                </div>
                            </div>
                            <p class="text-sm text-slate-300">{{ user.description }}</p>
                        </div>
                    </div>

                    <!-- Roles y Permisos -->
                    <div *ngIf="securityRoles && securityRoles.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Roles y Permisos:</h4>
                        <p-accordion>
                            <p-accordionTab *ngFor="let role of securityRoles" [header]="role.name">
                                <p class="text-slate-600 mb-3">{{ role.description }}</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse table-auto">
                                        <thead class="bg-surface-600 text-slate-200">
                                            <tr>
                                                <th class="border border-surface-500 p-2 text-left">Tabla/Objeto</th>
                                                <th class="border border-surface-500 p-2 text-left">Privilegios</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr *ngFor="let perm of role.permissions" class="hover:bg-surface-200">
                                                <td class="border border-surface-500 p-2 font-mono">{{ perm.table }}</td>
                                                <td class="border border-surface-500 p-2">
                                                    <div class="flex flex-wrap gap-1">
                                                        <p-chip
                                                            *ngFor="let priv of perm.privileges"
                                                            [label]="priv"
                                                            [styleClass]="
                                                                priv === 'SELECT'
                                                                    ? 'bg-blue-600 text-xs'
                                                                    : priv === 'INSERT'
                                                                      ? 'bg-green-600 text-xs'
                                                                      : priv === 'UPDATE'
                                                                        ? 'bg-orange-600 text-xs'
                                                                        : priv === 'DELETE'
                                                                          ? 'bg-red-600 text-xs'
                                                                          : priv === 'EXECUTE'
                                                                            ? 'bg-purple-600 text-xs'
                                                                            : 'bg-gray-600 text-xs'
                                                            "
                                                        >
                                                        </p-chip>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </p-accordionTab>
                        </p-accordion>
                    </div>
                    <!-- Políticas de Contraseñas -->
                    <div *ngIf="securityPasswordPolicy && securityPasswordPolicy.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Política de Contraseñas:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <ul class="list-disc list-inside pl-4">
                                <li *ngFor="let policy of securityPasswordPolicy" class="mb-2 text-slate-300">{{ policy }}</li>
                            </ul>
                        </div>
                    </div>
                    <!-- Auditoría -->
                    <div *ngIf="securityAuditPolicies && securityAuditPolicies.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Políticas de Auditoría:</h4>
                        <div *ngFor="let policy of securityAuditPolicies" class="mb-3 bg-surface-700 p-4 rounded-lg">
                            <h5 class="text-lg font-semibold mb-2 text-slate-200">{{ policy.name }}</h5>
                            <p class="text-sm text-slate-300 mb-2">{{ policy.description }}</p>
                            <div class="mb-2">
                                <p class="text-md font-medium text-gray-300">Tablas Auditadas:</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <p-chip *ngFor="let table of policy.tables" [label]="table" styleClass="bg-blue-600 text-xs"></p-chip>
                                </div>
                            </div>
                            <div>
                                <p class="text-md font-medium text-gray-300">Acciones Auditadas:</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <p-chip *ngFor="let action of policy.auditedActions" [label]="action" styleClass="bg-purple-600 text-xs"></p-chip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Roles y Permisos -->
                    <div *ngIf="securityRoles && securityRoles.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Roles y Permisos:</h4>
                        <p-accordion>
                            <p-accordionTab *ngFor="let role of securityRoles" [header]="role.name">
                                <p class="text-slate-600 mb-3">{{ role.description }}</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse table-auto">
                                        <thead class="bg-surface-600 text-slate-200">
                                            <tr>
                                                <th class="border border-surface-500 p-2 text-left">Tabla/Objeto</th>
                                                <th class="border border-surface-500 p-2 text-left">Privilegios</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr *ngFor="let perm of role.permissions" class="hover:bg-surface-200">
                                                <td class="border border-surface-500 p-2 font-mono">{{ perm.table }}</td>
                                                <td class="border border-surface-500 p-2">
                                                    <div class="flex flex-wrap gap-1">
                                                        <p-chip
                                                            *ngFor="let priv of perm.privileges"
                                                            [label]="priv"
                                                            [styleClass]="
                                                                priv === 'SELECT'
                                                                    ? 'bg-blue-600 text-xs'
                                                                    : priv === 'INSERT'
                                                                      ? 'bg-green-600 text-xs'
                                                                      : priv === 'UPDATE'
                                                                        ? 'bg-orange-600 text-xs'
                                                                        : priv === 'DELETE'
                                                                          ? 'bg-red-600 text-xs'
                                                                          : priv === 'EXECUTE'
                                                                            ? 'bg-purple-600 text-xs'
                                                                            : 'bg-gray-600 text-xs'
                                                            "
                                                        >
                                                        </p-chip>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </p-accordionTab>
                        </p-accordion>
                    </div>
                    <!-- Políticas de Contraseñas -->
                    <div *ngIf="securityPasswordPolicy && securityPasswordPolicy.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Política de Contraseñas:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <ul class="list-disc list-inside pl-4">
                                <li *ngFor="let policy of securityPasswordPolicy" class="mb-2 text-slate-300">{{ policy }}</li>
                            </ul>
                        </div>
                    </div>
                    <!-- Auditoría -->
                    <div *ngIf="securityAuditPolicies && securityAuditPolicies.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Políticas de Auditoría:</h4>
                        <div *ngFor="let policy of securityAuditPolicies" class="mb-3 bg-surface-700 p-4 rounded-lg">
                            <h5 class="text-lg font-semibold mb-2 text-slate-200">{{ policy.name }}</h5>
                            <p class="text-sm text-slate-300 mb-2">{{ policy.description }}</p>
                            <div class="mb-2">
                                <p class="text-md font-medium text-gray-300">Tablas Auditadas:</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <p-chip *ngFor="let table of policy.tables" [label]="table" styleClass="bg-blue-600 text-xs"></p-chip>
                                </div>
                            </div>
                            <div>
                                <p class="text-md font-medium text-gray-300">Acciones Auditadas:</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <p-chip *ngFor="let action of policy.auditedActions" [label]="action" styleClass="bg-purple-600 text-xs"></p-chip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mejores Prácticas de Seguridad -->
                    <div *ngIf="securityBestPractices && securityBestPractices.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Mejores Prácticas de Seguridad:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <ul class="list-disc list-inside pl-4">
                                <li *ngFor="let practice of securityBestPractices" class="mb-2 text-slate-300">{{ practice }}</li>
                            </ul>
                        </div>
                    </div>
                </p-tabPanel>
                    <!-- Mejores Prácticas de Seguridad -->
                    <div *ngIf="securityBestPractices && securityBestPractices.length > 0" class="mb-6">
                        <h4 class="text-xl font-medium text-slate-200 mb-3">Mejores Prácticas de Seguridad:</h4>
                        <div class="bg-surface-700 p-4 rounded-lg">
                            <ul class="list-disc list-inside pl-4">
                                <li *ngFor="let practice of securityBestPractices" class="mb-2 text-slate-300">{{ practice }}</li>
                            </ul>
                        </div>
                    </div>
                </p-tabPanel>

                <!-- Código SQL -->
                <p-tabPanel header="Código SQL">
                    <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>
                <!-- Código SQL -->
                <p-tabPanel header="Código SQL">
                    <app-code-card language="sql" [code]="sqlCode" (copy)="onCopy($event)"></app-code-card>
                </p-tabPanel>

                <!-- Diagrama de Seguridad -->
                <p-tabPanel header="Diagrama" *ngIf="securityDiagramUrl">
                    <div class="flex justify-center bg-surface-700 p-4 rounded-lg">
                        <img [src]="securityDiagramUrl" alt="Diagrama de seguridad" class="max-w-full h-auto" />
                    </div>
                    <p *ngIf="securityDiagramDescription" class="text-sm text-center text-gray-400 mt-2">{{ securityDiagramDescription }}</p>
                </p-tabPanel>
            </p-tabView>
        </section>
    `,
    styles: [
        `
            /* === TABVIEW – NAV BAR ============================================ */
            :host ::ng-deep .custom-tabview .p-tabview-nav {
                background: var(--surface-700);
                border-color: var(--surface-600);

                /* auto-scroll --------------------------------------------------- */
                overflow-x: auto; /* muestra scrollbar cuando sea necesario   */
                flex-wrap: nowrap; /* evita que los tabs brinquen a otra línea */
                scrollbar-width: thin; /* firefox                                  */
            }

            /* barra fina en navegadores WebKit */
            :host ::ng-deep .custom-tabview .p-tabview-nav::-webkit-scrollbar {
                height: 4px;
            }
            :host ::ng-deep .custom-tabview .p-tabview-nav::-webkit-scrollbar-thumb {
                background: var(--surface-500);
                border-radius: 2px;
            }

            /* === TABVIEW – ITEMS ============================================== */
            /* 1) menos espacio entre cada opción        */
            :host ::ng-deep .custom-tabview .p-tabview-nav li {
                margin-right: 0.25rem; /* antes ~0.5 rem — ahora la mitad  */
            }

            /* 2) padding interno más compacto           */
            :host ::ng-deep .custom-tabview .p-tabview-nav-link {
                padding: 0.45rem 0.75rem; /* alto × ancho                     */
            }

            /* resaltado activo (se conserva tu estilo)   */
            :host ::ng-deep .custom-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
                color: var(--primary-color);
                border-color: var(--primary-color);
            }
            :host ::ng-deep .p-accordion .p-accordion-header .p-accordion-header-link {
                background: var(--surface-600);
                color: var(--text-color);
                border-color: var(--surface-500);
            }
            :host ::ng-deep .p-accordion .p-accordion-content {
                background: var(--surface-700);
                color: var(--text-color);
                border-color: var(--surface-500);
            }
            :host ::ng-deep .p-tabpanels {
                background: var(--surface-800);
                border-color: var(--surface-700);
            }

            :host ::ng-deep .p-tablist-tab-list {
                background: var(--surface-700);
            }
        `
    ]
})
export class SecuritySectionComponent {
    @Input() securityName = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() users: SecurityUser[] = [];
    @Input() roles: SecurityRole[] = [];
    @Input() passwordPolicy: string[] = [];
    @Input() auditPolicies: SecurityAuditPolicy[] = [];
    @Input() securityBestPractices: string[] = [];
    @Input() securityDiagramUrl = '';
    @Input() securityDiagramDescription = '';
    @Input() securityDetail?: SecurityDetail;
    @Input() securityName = '';
    @Input() description = '';
    @Input() sqlCode = '';
    @Input() users: SecurityUser[] = [];
    @Input() roles: SecurityRole[] = [];
    @Input() passwordPolicy: string[] = [];
    @Input() auditPolicies: SecurityAuditPolicy[] = [];
    @Input() securityBestPractices: string[] = [];
    @Input() securityDiagramUrl = '';
    @Input() securityDiagramDescription = '';
    @Input() securityDetail?: SecurityDetail;

    constructor(private messageService: MessageService) {}
    constructor(private messageService: MessageService) {}
    // Getters para acceder a las propiedades del detalle de seguridad si está disponible
    get getSecurityName(): string {
        return this.securityName;
    }

    get securityDescription(): string {
        return this.description;
    }

    get securityUsers(): SecurityUser[] {
        if (this.securityDetail?.users) {
            return this.securityDetail.users.map((user) => ({
                username: user.username,
                description: user.description,
                roles: user.roles
            }));
        }
        return this.users;
    }

    get securityRoles(): SecurityRole[] {
        if (this.securityDetail?.roles) {
            return this.securityDetail.roles.map((role) => ({
                name: role.name,
                description: role.description,
                permissions: role.permissions.map((p) => ({
                    table: p.object,
                    privileges: p.privileges as any[]
                }))
            }));
        }
        return this.roles;
    }

    get securityPasswordPolicy(): string[] {
        return this.securityDetail?.passwordPolicy ? this.securityDetail.passwordPolicy.details : this.passwordPolicy;
    }

    get securityAuditPolicies(): SecurityAuditPolicy[] {
        if (this.securityDetail?.auditPolicy) {
            return [
                {
                    name: this.securityDetail.auditPolicy.name,
                    description: this.securityDetail.auditPolicy.description,
                    tables: [], // No mapeado directamente en el modelo
                    auditedActions: this.securityDetail.auditPolicy.details
                }
            ];
        }
        return this.auditPolicies;
    }

    get securityPractices(): string[] {
        return this.securityDetail?.bestPractices || this.securityBestPractices;
    }

    get securityDiagram(): string {
        return this.securityDetail?.securityDiagram?.url || this.securityDiagramUrl;
    }

    get securityDiagramDesc(): string {
        return this.securityDetail?.securityDiagram?.description || this.securityDiagramDescription;
    }

    get securitySQLCode(): string {
        return this.sqlCode;
    }
    get getSecurityName(): string {
        return this.securityName;
    }

    get securityDescription(): string {
        return this.description;
    }

    get securityUsers(): SecurityUser[] {
        if (this.securityDetail?.users) {
            return this.securityDetail.users.map((user) => ({
                username: user.username,
                description: user.description,
                roles: user.roles
            }));
        }
        return this.users;
    }

    get securityRoles(): SecurityRole[] {
        if (this.securityDetail?.roles) {
            return this.securityDetail.roles.map((role) => ({
                name: role.name,
                description: role.description,
                permissions: role.permissions.map((p) => ({
                    table: p.object,
                    privileges: p.privileges as any[]
                }))
            }));
        }
        return this.roles;
    }

    get securityPasswordPolicy(): string[] {
        return this.securityDetail?.passwordPolicy ? this.securityDetail.passwordPolicy.details : this.passwordPolicy;
    }

    get securityAuditPolicies(): SecurityAuditPolicy[] {
        if (this.securityDetail?.auditPolicy) {
            return [
                {
                    name: this.securityDetail.auditPolicy.name,
                    description: this.securityDetail.auditPolicy.description,
                    tables: [], // No mapeado directamente en el modelo
                    auditedActions: this.securityDetail.auditPolicy.details
                }
            ];
        }
        return this.auditPolicies;
    }

    get securityPractices(): string[] {
        return this.securityDetail?.bestPractices || this.securityBestPractices;
    }

    get securityDiagram(): string {
        return this.securityDetail?.securityDiagram?.url || this.securityDiagramUrl;
    }

    get securityDiagramDesc(): string {
        return this.securityDetail?.securityDiagram?.description || this.securityDiagramDescription;
    }

    get securitySQLCode(): string {
        return this.sqlCode;
    }

    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
    onCopy(txt: string) {
        navigator.clipboard.writeText(txt).then(() => this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
    }
}
