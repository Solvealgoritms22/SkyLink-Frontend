/* -----------------------------------------------------------------------------
   AirlineDocComponent – Angular 19 standalone demo (v3, sidebar sticky)
   -----------------------------------------------------------------------------
   • Sidebar ya NO se oculta nunca al interactuar con PanelMenu; se cierra sólo
     si tocas la ✖, la hamburguesa o presionas el atajo Ctrl/Cmd +B.
   • Logrado añadiendo dismissable="false" al <p-sidebar> y evitando que PrimeNG
     lo cierre tras un clic interno.
   -----------------------------------------------------------------------------*/

import {
  Component,
  AfterViewInit,
  OnInit,
  HostListener,
  HostBinding,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem, MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';

import { CodeCardComponent } from './code-card.component';
import { TableSectionComponent } from './sections/table-section.component';
import { FunctionSectionComponent } from './sections/function-section.component';
import { ProcedureSectionComponent } from './sections/procedure-section.component';
import { TriggerSectionComponent } from './sections/trigger-section.component';
import { ViewSectionComponent } from './sections/view-section.component';
import { EventSectionComponent } from './sections/event-section.component';
import { SecuritySectionComponent } from './sections/security-section.component';
import { GeneralInfoSectionComponent } from './sections/general-info-section.component';

// Import all SQL models
import { 
  generalInfo,
  tablesScript,
  functionsScript,
  proceduresScript,
  triggersScript,
  viewsScript,
  eventsScript,
  securityScript
} from './models';

@Component({
  selector: 'airline-doc',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
    RippleModule,
    ScrollPanelModule,
    ToastModule,
    TableSectionComponent,
    FunctionSectionComponent,
    ProcedureSectionComponent,
    TriggerSectionComponent,
    ViewSectionComponent,
    EventSectionComponent,
    SecuritySectionComponent,
    GeneralInfoSectionComponent,
  ],
  providers: [MessageService],
  template: `
    <div class="flex h-screen font-sans bg-surface-900 text-slate-100">
      <!-- Botón hamburguesa / atajo Ctrl+B -->
      <button pButton type="button" title="Menú (Ctrl+B)"
              aria-label="Abrir menú"
              icon="pi pi-bars"
              class="p-button-text p-button-rounded fixed top-4 left-4 z-50 text-white"
              [class.hidden]="sidebarVisible && isDesktop"
              (click)="toggleSidebar()"></button>

      <!-- Sidebar oscuro pegajoso -->
      <p-sidebar [(visible)]="sidebarVisible"
                 [modal]="!isDesktop"
                 [dismissible]="false"
                 [showCloseIcon]="true"              
                 [baseZIndex]="1000"
                 styleClass="dark sidebar-dark-theme">
        <ng-template pTemplate="content">
          <div class="p-3 h-full flex flex-col">
            <header class="flex items-center gap-3 mb-6 select-none">
              <i class="pi pi-database text-primary text-2xl"></i>
              <h1 class="text-xl font-semibold text-primary">Airline DB</h1>
            </header>
            <p-scrollPanel [ngStyle]="{'width': '100%', 'flex': '1 1 auto'}">
              <p-panelMenu [model]="menuItems" [style]="{'border':'none','width':'100%'}"
                           styleClass="sidebar-menu"></p-panelMenu>
            </p-scrollPanel>
          </div>
        </ng-template>
      </p-sidebar>
      
      <!-- Área principal -->
      <main class="flex-1 overflow-y-auto p-6 md:p-10 bg-surface-900 transition-all"
            [class.ml-0]="!sidebarVisible || !isDesktop"
            [class.ml-72]="sidebarVisible && isDesktop">

        <ng-container [ngSwitch]="activeSection">
          <!-- Información General -->
          <app-general-info-section *ngSwitchCase="'database'" 
                      [sqlCode]="generalInfo">
          </app-general-info-section>
          
          <!-- Tablas -->
          <app-table-section *ngSwitchCase="'table_airports'"
            tableName="airports"
            description="Almacena información de aeropuertos incluyendo código IATA, nombre, ciudad, país, coordenadas y zona horaria."
            [sqlCode]="tablesScript.airports">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_airlines'"
            tableName="airlines"
            description="Registra datos de aerolíneas como código IATA, nombre y señal de llamada."
            [sqlCode]="tablesScript.airlines">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_aircraft'"
            tableName="aircraft"
            description="Guarda información de aeronaves incluyendo número de cola, aerolínea, modelo, capacidad y año de fabricación."
            [sqlCode]="tablesScript.aircraft">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_routes'"
            tableName="routes"
            description="Define rutas de vuelo entre aeropuertos con su aerolínea operadora y distancia."
            [sqlCode]="tablesScript.routes">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_flights'"
            tableName="flights"
            description="Almacena detalles de vuelos programados incluyendo ruta, aeronave, horarios y estado."
            [sqlCode]="tablesScript.flights">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_passengers'"
            tableName="passengers"
            description="Contiene datos de pasajeros como nombre, fecha de nacimiento, email y teléfono."
            [sqlCode]="tablesScript.passengers">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_fare_classes'"
            tableName="fare_classes"
            description="Define clases de tarifa con su código, descripción y multiplicador de precio."
            [sqlCode]="tablesScript.fare_classes">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_flight_fares'"
            tableName="flight_fares"
            description="Gestiona precios y asientos disponibles por vuelo y clase de tarifa."
            [sqlCode]="tablesScript.flight_fares">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_loyalty_programs'"
            tableName="loyalty_programs"
            description="Administra programas de lealtad con diferentes niveles y balance de puntos."
            [sqlCode]="tablesScript.loyalty_programs">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_bookings'"
            tableName="bookings"
            description="Registra reservas con código único, fecha, estado y monto total."
            [sqlCode]="tablesScript.bookings">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_booking_passengers'"
            tableName="booking_passengers"
            description="Asocia pasajeros a reservas con su clase de tarifa y puntos otorgados."
            [sqlCode]="tablesScript.booking_passengers">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_tickets'"
            tableName="tickets"
            description="Almacena boletos emitidos con información de reserva, vuelo, pasajero, asiento y precio."
            [sqlCode]="tablesScript.tickets">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_payments'"
            tableName="payments"
            description="Gestiona pagos de reservas con monto, método y estado."
            [sqlCode]="tablesScript.payments">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_baggage'"
            tableName="baggage"
            description="Registra equipajes por boleto con peso y etiqueta única."
            [sqlCode]="tablesScript.baggage">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_staff'"
            tableName="staff"
            description="Contiene datos del personal con nombre, rol, fecha de contratación y aerolínea."
            [sqlCode]="tablesScript.staff">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_crew_assignments'"
            tableName="crew_assignments"
            description="Asigna personal a vuelos con su posición específica."
            [sqlCode]="tablesScript.crew_assignments">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_checkins'"
            tableName="checkins"
            description="Registra el check-in de pasajeros con hora y cantidad de equipaje."
            [sqlCode]="tablesScript.checkins">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_boarding_passes'"
            tableName="boarding_passes"
            description="Gestiona tarjetas de embarque con puerta, hora de abordaje y número de asiento."
            [sqlCode]="tablesScript.boarding_passes">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_maintenance_logs'"
            tableName="maintenance_logs"
            description="Registra mantenimientos programados para aeronaves con fecha, descripción y estado."
            [sqlCode]="tablesScript.maintenance_logs">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_flight_status_history'"
            tableName="flight_status_history"
            description="Historial de cambios de estado de vuelos con fecha y hora."
            [sqlCode]="tablesScript.flight_status_history">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_audit_logs'"
            tableName="audit_logs"
            description="Registro de operaciones de auditoría en la base de datos (inserción, actualización, eliminación)."
            [sqlCode]="tablesScript.audit_logs">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_reservations_history'"
            tableName="reservations_history"
            description="Historial de cambios de estado de reservas."
            [sqlCode]="tablesScript.reservations_history">
          </app-table-section>

          <app-table-section *ngSwitchCase="'table_seat_inventory'"
            tableName="seat_inventory"
            description="Gestiona inventario de asientos por vuelo y clase de tarifa."
            [sqlCode]="tablesScript.seat_inventory">
          </app-table-section>

          <!-- Funciones -->
          <app-function-section *ngSwitchCase="'fn_calculate_fare'"
            functionName="fn_calculate_fare"
            description="Calcula la tarifa final multiplicando la tarifa base por un multiplicador."
            [sqlCode]="functionsScript.fn_calculate_fare">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_distance_km'"
            functionName="fn_distance_km"
            description="Calcula la distancia en kilómetros entre dos puntos geográficos mediante la fórmula haversine."
            [sqlCode]="functionsScript.fn_distance_km">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_flight_duration'"
            functionName="fn_flight_duration"
            description="Calcula la duración de un vuelo en minutos entre la hora de salida y llegada."
            [sqlCode]="functionsScript.fn_flight_duration">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_available_seats'"
            functionName="fn_available_seats"
            description="Calcula los asientos disponibles para un vuelo y clase de tarifa."
            [sqlCode]="functionsScript.fn_available_seats">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_flight_occupancy'"
            functionName="fn_flight_occupancy"
            description="Calcula el porcentaje de ocupación de un vuelo."
            [sqlCode]="functionsScript.fn_flight_occupancy">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_format_currency'"
            functionName="fn_format_currency"
            description="Formatea un valor monetario con símbolo y decimales."
            [sqlCode]="functionsScript.fn_format_currency">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_loyalty_tier'"
            functionName="fn_loyalty_tier"
            description="Determina el nivel de lealtad basado en la cantidad de puntos."
            [sqlCode]="functionsScript.fn_loyalty_tier">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_flight_number_format'"
            functionName="fn_flight_number_format"
            description="Genera un número de vuelo formateado según el estándar."
            [sqlCode]="functionsScript.fn_flight_number_format">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_total_baggage_weight'"
            functionName="fn_total_baggage_weight"
            description="Calcula el peso total del equipaje para un boleto."
            [sqlCode]="functionsScript.fn_total_baggage_weight">
          </app-function-section>

          <app-function-section *ngSwitchCase="'fn_seats_by_class'"
            functionName="fn_seats_by_class"
            description="Devuelve el total de asientos para una clase en un vuelo."
            [sqlCode]="functionsScript.fn_seats_by_class">
          </app-function-section>

          <!-- Procedimientos -->
          <app-procedure-section *ngSwitchCase="'sp_create_booking'"
            procedureName="sp_create_booking"
            description="Crea una nueva reserva para un pasajero, calcula la tarifa y genera un código único."
            [sqlCode]="proceduresScript.sp_create_booking">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_confirm_booking'"
            procedureName="sp_confirm_booking"
            description="Confirma una reserva y registra el cambio en el historial."
            [sqlCode]="proceduresScript.sp_confirm_booking">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_check_in_passenger'"
            procedureName="sp_check_in_passenger"
            description="Registra el check-in de un pasajero para un vuelo específico."
            [sqlCode]="proceduresScript.sp_check_in_passenger">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_cancel_booking'"
            procedureName="sp_cancel_booking"
            description="Cancela una reserva existente y actualiza el historial."
            [sqlCode]="proceduresScript.sp_cancel_booking">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_assign_crew'"
            procedureName="sp_assign_crew"
            description="Asigna una tripulación a un vuelo específico."
            [sqlCode]="proceduresScript.sp_assign_crew">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_add_payment'"
            procedureName="sp_add_payment"
            description="Registra un pago para una reserva y actualiza el estado de la misma."
            [sqlCode]="proceduresScript.sp_add_payment">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_upgrade_seat'"
            procedureName="sp_upgrade_seat"
            description="Actualiza la clase de tarifa de un asiento en un ticket."
            [sqlCode]="proceduresScript.sp_upgrade_seat">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_create_flight'"
            procedureName="sp_create_flight"
            description="Crea un nuevo vuelo programado en el sistema."
            [sqlCode]="proceduresScript.sp_create_flight">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_complete_maintenance'"
            procedureName="sp_complete_maintenance"
            description="Marca un registro de mantenimiento como completado."
            [sqlCode]="proceduresScript.sp_complete_maintenance">
          </app-procedure-section>

          <app-procedure-section *ngSwitchCase="'sp_generate_daily_report'"
            procedureName="sp_generate_daily_report"
            description="Genera un reporte diario de ingresos por vuelo."
            [sqlCode]="proceduresScript.sp_generate_daily_report">
          </app-procedure-section>

          <!-- Triggers -->
          <app-trigger-section *ngSwitchCase="'trg_after_booking_confirm'"
            triggerName="trg_after_booking_confirm"
            description="Registra en la tabla de auditoría cuando se confirma una reserva."
            [sqlCode]="triggersScript.trg_after_booking_confirm">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_payment_insert'"
            triggerName="trg_after_payment_insert"
            description="Confirma automáticamente una reserva cuando se registra un pago."
            [sqlCode]="triggersScript.trg_after_payment_insert">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_checkin_auto_bp'"
            triggerName="trg_checkin_auto_bp"
            description="Genera automáticamente una tarjeta de embarque cuando un pasajero hace check-in."
            [sqlCode]="triggersScript.trg_checkin_auto_bp">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_ticket_insert'"
            triggerName="trg_after_ticket_insert"
            description="Actualiza el inventario de asientos cuando se crea un nuevo boleto."
            [sqlCode]="triggersScript.trg_after_ticket_insert">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_ticket_delete'"
            triggerName="trg_after_ticket_delete"
            description="Actualiza el inventario de asientos cuando se elimina un boleto."
            [sqlCode]="triggersScript.trg_after_ticket_delete">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_maintenance_insert'"
            triggerName="trg_after_maintenance_insert"
            description="Cambia el estado de los vuelos a 'Mantenimiento' cuando se programa un mantenimiento para la aeronave."
            [sqlCode]="triggersScript.trg_after_maintenance_insert">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_maintenance_complete'"
            triggerName="trg_after_maintenance_complete"
            description="Restaura el estado de los vuelos a 'Programado' cuando se completa el mantenimiento de la aeronave."
            [sqlCode]="triggersScript.trg_after_maintenance_complete">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_after_loyalty_transaction'"
            triggerName="trg_after_loyalty_transaction"
            description="Actualiza el balance de puntos de lealtad cuando se registran nuevos puntos."
            [sqlCode]="triggersScript.trg_after_loyalty_transaction">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_flight_status_update'"
            triggerName="trg_flight_status_update"
            description="Registra en el historial cada cambio de estado de un vuelo."
            [sqlCode]="triggersScript.trg_flight_status_update">
          </app-trigger-section>

          <app-trigger-section *ngSwitchCase="'trg_audit_delete_booking'"
            triggerName="trg_audit_delete_booking"
            description="Registra en la auditoría cuando se elimina una reserva del sistema."
            [sqlCode]="triggersScript.trg_audit_delete_booking">
          </app-trigger-section>

          <!-- Vistas -->
          <app-view-section *ngSwitchCase="'vw_upcoming_flights'"
            viewName="vw_upcoming_flights"
            description="Muestra los vuelos futuros con información de origen, destino y estado."
            [sqlCode]="viewsScript.vw_upcoming_flights">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_flight_manifest'"
            viewName="vw_flight_manifest"
            description="Lista de pasajeros en un vuelo con sus asientos asignados."
            [sqlCode]="viewsScript.vw_flight_manifest">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_flight_revenue'"
            viewName="vw_flight_revenue"
            description="Calcula los ingresos totales por vuelo."
            [sqlCode]="viewsScript.vw_flight_revenue">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_loyalty_member_points'"
            viewName="vw_loyalty_member_points"
            description="Muestra los puntos acumulados por cada miembro del programa de lealtad."
            [sqlCode]="viewsScript.vw_loyalty_member_points">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_airport_traffic'"
            viewName="vw_airport_traffic"
            description="Muestra el número de vuelos que salen de cada aeropuerto durante el día actual."
            [sqlCode]="viewsScript.vw_airport_traffic">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_daily_sales'"
            viewName="vw_daily_sales"
            description="Presenta el total de ventas diarias agrupadas por fecha."
            [sqlCode]="viewsScript.vw_daily_sales">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_crew_schedule'"
            viewName="vw_crew_schedule"
            description="Muestra la programación de la tripulación por vuelo con sus posiciones asignadas."
            [sqlCode]="viewsScript.vw_crew_schedule">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_flight_status_latest'"
            viewName="vw_flight_status_latest"
            description="Proporciona el estado actual de los próximos vuelos programados."
            [sqlCode]="viewsScript.vw_flight_status_latest">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_seat_availability'"
            viewName="vw_seat_availability"
            description="Muestra los asientos disponibles por vuelo y clase de tarifa."
            [sqlCode]="viewsScript.vw_seat_availability">
          </app-view-section>

          <app-view-section *ngSwitchCase="'vw_booking_summary'"
            viewName="vw_booking_summary"
            description="Presenta un resumen de las reservas con su estado, monto total y número de pasajeros."
            [sqlCode]="viewsScript.vw_booking_summary">
          </app-view-section>

          <!-- Eventos -->
          <app-event-section *ngSwitchCase="'ev_archive_old_flights'"
            eventName="ev_archive_old_flights"
            description="Archiva vuelos de más de un año de antigüedad en la tabla de auditoría."
            [sqlCode]="eventsScript.ev_archive_old_flights">
          </app-event-section>

          <app-event-section *ngSwitchCase="'ev_update_flight_status'"
            eventName="ev_update_flight_status"
            description="Actualiza automáticamente el estado de los vuelos a 'Departed' cuando pasa su hora de salida."
            [sqlCode]="eventsScript.ev_update_flight_status">
          </app-event-section>

          <app-event-section *ngSwitchCase="'ev_cleanup_expired_bookings'"
            eventName="ev_cleanup_expired_bookings"
            description="Elimina automáticamente las reservas pendientes que han caducado (más de 24 horas de antigüedad)."
            [sqlCode]="eventsScript.ev_cleanup_expired_bookings">
          </app-event-section>

          <app-event-section *ngSwitchCase="'ev_send_departure_reminders'"
            eventName="ev_send_departure_reminders"
            description="Envía recordatorios automáticos para vuelos que saldrán en las próximas 3 horas."
            [sqlCode]="eventsScript.ev_send_departure_reminders">
          </app-event-section>

          <app-event-section *ngSwitchCase="'ev_award_loyalty_monthly'"
            eventName="ev_award_loyalty_monthly"
            description="Actualiza automáticamente los niveles de lealtad de los miembros basado en sus puntos acumulados mensualmente."
            [sqlCode]="eventsScript.ev_award_loyalty_monthly">
          </app-event-section>

          <!-- Seguridad -->
          <app-security-section *ngSwitchCase="'security'"
            securityTitle="Roles y Usuarios"
            description="Configuración de roles, usuarios y privilegios para la gestión segura de la base de datos."
            [sqlCode]="securityScript">
          </app-security-section>
        </ng-container>
      </main>

      <p-toast position="bottom-center"></p-toast>
    </div>
  `,
  styles: [
    `:host ::ng-deep pre[class*='language-'],
    :host ::ng-deep code[class*='language-']{background:transparent!important;box-shadow:none!important;}
    :host ::ng-deep .sidebar-dark-theme{@apply bg-slate-800 text-slate-100 shadow-xl;}
    :host ::ng-deep .sidebar-dark-theme .p-sidebar-header{@apply bg-slate-900 border-b border-slate-700;}
    :host ::ng-deep .sidebar-menu .p-panelmenu-header>a{@apply bg-transparent text-slate-200 rounded-lg px-4 py-3 font-medium transition;}
    :host ::ng-deep .sidebar-menu .p-panelmenu-header:not(.p-highlight):not(.p-disabled)>a:hover{@apply bg-slate-700 text-white translate-x-1;}
    :host ::ng-deep .sidebar-menu .p-panelmenu-header.p-highlight>a{@apply bg-blue-600/20 text-blue-400;}
    :host ::ng-deep .sidebar-menu .p-panelmenu-content .p-menuitem-link{@apply px-4 py-2 text-slate-300 rounded-md transition;}
    :host ::ng-deep .sidebar-menu .p-panelmenu-content .p-menuitem-link:hover{@apply bg-slate-700 text-white translate-x-1;}
    :host ::ng-deep .p-scrollpanel-bar{@apply bg-slate-600 rounded-xl;}
  `],
})
export class AirlineDocComponent implements OnInit, AfterViewInit {
  sidebarVisible = false;
  isDesktop = false;
  activeSection = 'database';
  menuItems: MenuItem[] = [];
  public tablesScript = tablesScript;
  public functionsScript = functionsScript;
  public proceduresScript = proceduresScript;
  public triggersScript = triggersScript;
  public viewsScript = viewsScript;
  public eventsScript = eventsScript;
  public securityScript = securityScript;
  public generalInfo = generalInfo;

  private toast = inject(MessageService);

  ngOnInit() {
    this.updateResponsive();
    this.buildMenu();
    Prism.highlightAll();
  }
  ngAfterViewInit() {}

  toggleSidebar() { this.sidebarVisible = !this.sidebarVisible; }
  navigateTo(section: string) { this.activeSection = section; }  
  
  private buildMenu() {
    this.menuItems = [
      { label: 'General', icon: 'pi pi-info-circle', items: [
          { label: 'Información General', icon: 'pi pi-home', command: () => this.navigateTo('database') },
      ]},
      { label: 'Tablas', icon: 'pi pi-table', items: [
          { label: 'Aeropuertos', icon: 'pi pi-map-marker', command: () => this.navigateTo('table_airports') },
          { label: 'Aerolíneas', icon: 'pi pi-tag', command: () => this.navigateTo('table_airlines') },
          { label: 'Aeronaves', icon: 'pi pi-send', command: () => this.navigateTo('table_aircraft') },
          { label: 'Rutas', icon: 'pi pi-map', command: () => this.navigateTo('table_routes') },
          { label: 'Vuelos', icon: 'pi pi-calendar', command: () => this.navigateTo('table_flights') },
          { label: 'Pasajeros', icon: 'pi pi-users', command: () => this.navigateTo('table_passengers') },
          { label: 'Clases de Tarifa', icon: 'pi pi-ticket', command: () => this.navigateTo('table_fare_classes') },
          { label: 'Tarifas de Vuelos', icon: 'pi pi-money-bill', command: () => this.navigateTo('table_flight_fares') },
          { label: 'Programas de Lealtad', icon: 'pi pi-star', command: () => this.navigateTo('table_loyalty_programs') },
          { label: 'Reservas', icon: 'pi pi-bookmark', command: () => this.navigateTo('table_bookings') },
          { label: 'Pasajeros de Reservas', icon: 'pi pi-users', command: () => this.navigateTo('table_booking_passengers') },
          { label: 'Boletos', icon: 'pi pi-ticket', command: () => this.navigateTo('table_tickets') },
          { label: 'Pagos', icon: 'pi pi-credit-card', command: () => this.navigateTo('table_payments') },
          { label: 'Equipaje', icon: 'pi pi-briefcase', command: () => this.navigateTo('table_baggage') },
          { label: 'Personal', icon: 'pi pi-user', command: () => this.navigateTo('table_staff') },
          { label: 'Asignación de Tripulación', icon: 'pi pi-users', command: () => this.navigateTo('table_crew_assignments') },
          { label: 'Check-ins', icon: 'pi pi-check-square', command: () => this.navigateTo('table_checkins') },
          { label: 'Tarjetas de Embarque', icon: 'pi pi-id-card', command: () => this.navigateTo('table_boarding_passes') },
          { label: 'Registro de Mantenimiento', icon: 'pi pi-wrench', command: () => this.navigateTo('table_maintenance_logs') },
          { label: 'Historial de Estado de Vuelo', icon: 'pi pi-history', command: () => this.navigateTo('table_flight_status_history') },
          { label: 'Registros de Auditoría', icon: 'pi pi-list', command: () => this.navigateTo('table_audit_logs') },
          { label: 'Historial de Reservas', icon: 'pi pi-history', command: () => this.navigateTo('table_reservations_history') },
          { label: 'Inventario de Asientos', icon: 'pi pi-th-large', command: () => this.navigateTo('table_seat_inventory') },
      ]},
      { label: 'Funciones', icon: 'pi pi-calculator', items: [
          { label: 'Calcular Tarifa', icon: 'pi pi-dollar', command: () => this.navigateTo('fn_calculate_fare') },
          { label: 'Calcular Distancia', icon: 'pi pi-compass', command: () => this.navigateTo('fn_distance_km') },
          { label: 'Duración de Vuelo', icon: 'pi pi-clock', command: () => this.navigateTo('fn_flight_duration') },
          { label: 'Asientos Disponibles', icon: 'pi pi-th-large', command: () => this.navigateTo('fn_available_seats') },
          { label: 'Ocupación de Vuelo', icon: 'pi pi-chart-bar', command: () => this.navigateTo('fn_flight_occupancy') },
          { label: 'Formatear Moneda', icon: 'pi pi-dollar', command: () => this.navigateTo('fn_format_currency') },
          { label: 'Nivel de Lealtad', icon: 'pi pi-star', command: () => this.navigateTo('fn_loyalty_tier') },
          { label: 'Formato Número de Vuelo', icon: 'pi pi-hashtag', command: () => this.navigateTo('fn_flight_number_format') },
          { label: 'Peso Total de Equipaje', icon: 'pi pi-briefcase', command: () => this.navigateTo('fn_total_baggage_weight') },
          { label: 'Asientos por Clase', icon: 'pi pi-th', command: () => this.navigateTo('fn_seats_by_class') },
      ]},
      { label: 'Procedimientos', icon: 'pi pi-cog', items: [
          { label: 'Crear Reserva', icon: 'pi pi-plus', command: () => this.navigateTo('sp_create_booking') },
          { label: 'Confirmar Reserva', icon: 'pi pi-check', command: () => this.navigateTo('sp_confirm_booking') },
          { label: 'Cancelar Reserva', icon: 'pi pi-times', command: () => this.navigateTo('sp_cancel_booking') },
          { label: 'Check-in de Pasajero', icon: 'pi pi-user-plus', command: () => this.navigateTo('sp_check_in_passenger') },
          { label: 'Asignar Tripulación', icon: 'pi pi-users', command: () => this.navigateTo('sp_assign_crew') },
          { label: 'Añadir Pago', icon: 'pi pi-credit-card', command: () => this.navigateTo('sp_add_payment') },
          { label: 'Mejorar Asiento', icon: 'pi pi-arrow-up', command: () => this.navigateTo('sp_upgrade_seat') },
          { label: 'Crear Vuelo', icon: 'pi pi-plus-circle', command: () => this.navigateTo('sp_create_flight') },
          { label: 'Completar Mantenimiento', icon: 'pi pi-check-circle', command: () => this.navigateTo('sp_complete_maintenance') },
          { label: 'Generar Reporte Diario', icon: 'pi pi-chart-line', command: () => this.navigateTo('sp_generate_daily_report') },
      ]},
      { label: 'Triggers', icon: 'pi pi-bolt', items: [
          { label: 'Confirmación de Reserva', icon: 'pi pi-bookmark', command: () => this.navigateTo('trg_after_booking_confirm') },
          { label: 'Inserción de Pago', icon: 'pi pi-credit-card', command: () => this.navigateTo('trg_after_payment_insert') },
          { label: 'Check‑in Auto BP', icon: 'pi pi-check-square', command: () => this.navigateTo('trg_checkin_auto_bp') },
          { label: 'Inserción de Ticket', icon: 'pi pi-ticket', command: () => this.navigateTo('trg_after_ticket_insert') },
          { label: 'Eliminación de Ticket', icon: 'pi pi-trash', command: () => this.navigateTo('trg_after_ticket_delete') },
          { label: 'Inserción de Mantenimiento', icon: 'pi pi-wrench', command: () => this.navigateTo('trg_after_maintenance_insert') },
          { label: 'Completar Mantenimiento', icon: 'pi pi-check', command: () => this.navigateTo('trg_after_maintenance_complete') },
          { label: 'Transacción de Lealtad', icon: 'pi pi-star', command: () => this.navigateTo('trg_after_loyalty_transaction') },
          { label: 'Actualizar Estado de Vuelo', icon: 'pi pi-sync', command: () => this.navigateTo('trg_flight_status_update') },
          { label: 'Auditar Eliminación de Reserva', icon: 'pi pi-shield', command: () => this.navigateTo('trg_audit_delete_booking') },
      ]},
      { label: 'Vistas', icon: 'pi pi-eye', items: [
          { label: 'Próximos Vuelos', icon: 'pi pi-calendar', command: () => this.navigateTo('vw_upcoming_flights') },
          { label: 'Manifiesto de Vuelo', icon: 'pi pi-list', command: () => this.navigateTo('vw_flight_manifest') },
          { label: 'Ingresos por Vuelo', icon: 'pi pi-money-bill', command: () => this.navigateTo('vw_flight_revenue') },
          { label: 'Puntos de Miembros', icon: 'pi pi-star', command: () => this.navigateTo('vw_loyalty_member_points') },
          { label: 'Tráfico en Aeropuertos', icon: 'pi pi-building', command: () => this.navigateTo('vw_airport_traffic') },
          { label: 'Ventas Diarias', icon: 'pi pi-chart-bar', command: () => this.navigateTo('vw_daily_sales') },
          { label: 'Programación de Tripulación', icon: 'pi pi-users', command: () => this.navigateTo('vw_crew_schedule') },
          { label: 'Estado de Vuelos', icon: 'pi pi-info-circle', command: () => this.navigateTo('vw_flight_status_latest') },
          { label: 'Disponibilidad de Asientos', icon: 'pi pi-th-large', command: () => this.navigateTo('vw_seat_availability') },
          { label: 'Resumen de Reservas', icon: 'pi pi-bookmark', command: () => this.navigateTo('vw_booking_summary') },
      ]},
      { label: 'Eventos', icon: 'pi pi-clock', items: [
          { label: 'Archivar Vuelos Antiguos', icon: 'pi pi-inbox', command: () => this.navigateTo('ev_archive_old_flights') },
          { label: 'Actualizar Estado de Vuelo', icon: 'pi pi-sync', command: () => this.navigateTo('ev_update_flight_status') },
          { label: 'Limpiar Reservas Expiradas', icon: 'pi pi-trash', command: () => this.navigateTo('ev_cleanup_expired_bookings') },
          { label: 'Enviar Recordatorios de Salida', icon: 'pi pi-bell', command: () => this.navigateTo('ev_send_departure_reminders') },
          { label: 'Asignar Lealtad Mensual', icon: 'pi pi-star', command: () => this.navigateTo('ev_award_loyalty_monthly') },
      ]},
      { label: 'Seguridad', icon: 'pi pi-shield', items: [
          { label: 'Roles y Usuarios', icon: 'pi pi-users', command: () => this.navigateTo('security') },
      ]},
    ];
  }

  onCopy(txt: string) {
    navigator.clipboard.writeText(txt).then(() =>
      this.toast.add({ severity: 'success', summary: 'Copiado', detail: 'Código al portapapeles', life: 1500 }));
  }

  @HostListener('window:resize') updateResponsive() {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) this.sidebarVisible = true;
  }

  @HostListener('document:keydown', ['$event']) key(ev: KeyboardEvent) {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'b') {
      ev.preventDefault();
      this.toggleSidebar();
    }
  }

  @HostBinding('class.is-desktop') get hostDesktop() { return this.isDesktop; }
}
