/**
 * Modelo de datos detallados para procedimientos almacenados SQL
 */

import { TableColumn } from './sql-data-dictionary.model';

export interface ProcedureParameter {
  name: string;
  type: string;
  direction: 'IN' | 'OUT' | 'INOUT';
  description: string;
  defaultValue?: string;
}

export interface TableOperation {
  tableName: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  description: string;
  condition?: string;
}

export interface ProcedureDetail {
  name: string;
  description: string;
  parameters: ProcedureParameter[];
  tableOperations: TableOperation[];
  transactionInfo: {
    usesTransaction: boolean;
    isolationLevel?: string;
    rollbackConditions?: string[];
  };
  errorHandling: {
    handlesErrors: boolean;
    errorCodes?: { code: string; description: string }[];
    strategy?: string;
  };
  flowDiagram?: {
    steps: {
      step: number;
      description: string;
      code?: string;
    }[];
  };
  exampleUsages: {
    description: string;
    sql: string;
    result?: string;
  }[];
}

export const procedureDetails: { [key: string]: ProcedureDetail } = {
  sp_create_booking: {
    name: 'sp_create_booking',
    description: 'Crea una nueva reserva para uno o más pasajeros en vuelos específicos, calculando la tarifa total y generando un código único de reserva.',
    parameters: [
      {
        name: 'p_passenger_id',
        type: 'INT',
        direction: 'IN',
        description: 'ID del pasajero principal que realiza la reserva'
      },
      {
        name: 'p_flight_ids',
        type: 'VARCHAR(255)',
        direction: 'IN',
        description: 'Lista de IDs de vuelos separados por comas'
      },
      {
        name: 'p_fare_class_code',
        type: 'CHAR(1)',
        direction: 'IN',
        description: 'Código de la clase de tarifa (E: Economy, B: Business, F: First)'
      },
      {
        name: 'p_booking_code',
        type: 'VARCHAR(8)',
        direction: 'OUT',
        description: 'Código único de reserva generado'
      },
      {
        name: 'p_total_amount',
        type: 'DECIMAL(10,2)',
        direction: 'OUT',
        description: 'Monto total calculado para la reserva'
      }
    ],
    tableOperations: [
      {
        tableName: 'flights',
        operation: 'SELECT',
        description: 'Verifica disponibilidad y obtiene detalles de los vuelos',
        condition: 'flight_id IN (IDs proporcionados) AND departure_time > CURRENT_TIMESTAMP'
      },
      {
        tableName: 'flight_fares',
        operation: 'SELECT',
        description: 'Obtiene tarifas y verifica disponibilidad de asientos',
        condition: 'flight_id IN (IDs proporcionados) AND fare_class_code = p_fare_class_code AND seats_available > 0'
      },
      {
        tableName: 'bookings',
        operation: 'INSERT',
        description: 'Crea un nuevo registro de reserva'
      },
      {
        tableName: 'booking_passengers',
        operation: 'INSERT',
        description: 'Asocia el pasajero a la reserva creada'
      },
      {
        tableName: 'flight_fares',
        operation: 'UPDATE',
        description: 'Reduce el número de asientos disponibles',
        condition: 'flight_id IN (IDs proporcionados) AND fare_class_code = p_fare_class_code'
      }
    ],
    transactionInfo: {
      usesTransaction: true,
      isolationLevel: 'READ COMMITTED',
      rollbackConditions: [
        'Vuelo no disponible',
        'No hay asientos disponibles en la clase seleccionada',
        'Error al insertar en la tabla de reservas',
        'Error al insertar en la tabla de pasajeros de reserva'
      ]
    },
    errorHandling: {
      handlesErrors: true,
      errorCodes: [
        { code: '45000', description: 'Vuelo no encontrado o no disponible' },
        { code: '45001', description: 'No hay asientos disponibles en la clase seleccionada' }
      ],
      strategy: 'Utiliza bloques DECLARE EXIT HANDLER para capturar errores, registra el error en la tabla de logs y hace ROLLBACK de la transacción'
    },
    flowDiagram: {
      steps: [
        { step: 1, description: 'Validar existencia y disponibilidad de vuelos' },
        { step: 2, description: 'Verificar disponibilidad de asientos en la clase seleccionada' },
        { step: 3, description: 'Calcular tarifa total' },
        { step: 4, description: 'Iniciar transacción' },
        { step: 5, description: 'Generar código único de reserva' },
        { step: 6, description: 'Insertar registro de reserva' },
        { step: 7, description: 'Insertar registros de pasajeros asociados a la reserva' },
        { step: 8, description: 'Actualizar asientos disponibles' },
        { step: 9, description: 'Confirmar transacción si todo es correcto' }
      ]
    },
    exampleUsages: [
      {
        description: 'Crear una reserva para el pasajero 1234 en los vuelos 101 y 102 en clase Business',
        sql: "CALL sp_create_booking(1234, '101,102', 'B', @booking_code, @total_amount);\nSELECT @booking_code, @total_amount;",
        result: "+---------------+---------------+\n| @booking_code | @total_amount |\n+---------------+---------------+\n| SL7X45Z       | 1250.75       |\n+---------------+---------------+"
      }
    ]
  },
  sp_confirm_booking: {
    name: 'sp_confirm_booking',
    description: 'Confirma una reserva existente, cambiando su estado de "Pendiente" a "Confirmado" y registra el cambio en el historial.',
    parameters: [
      {
        name: 'p_booking_code',
        type: 'VARCHAR(8)',
        direction: 'IN',
        description: 'Código de la reserva a confirmar'
      },
      {
        name: 'p_success',
        type: 'BOOLEAN',
        direction: 'OUT',
        description: 'Indica si la operación fue exitosa'
      }
    ],
    tableOperations: [
      {
        tableName: 'bookings',
        operation: 'SELECT',
        description: 'Verifica existencia de la reserva y que su estado sea "Pendiente"',
        condition: 'booking_code = p_booking_code AND status = "Pending"'
      },
      {
        tableName: 'bookings',
        operation: 'UPDATE',
        description: 'Actualiza el estado de la reserva a "Confirmed"',
        condition: 'booking_code = p_booking_code'
      },
      {
        tableName: 'reservations_history',
        operation: 'INSERT',
        description: 'Registra el cambio de estado en el historial'
      }
    ],
    transactionInfo: {
      usesTransaction: true,
      isolationLevel: 'READ COMMITTED',
      rollbackConditions: [
        'Reserva no encontrada',
        'Estado de reserva diferente a "Pending"',
        'Error al actualizar el estado de la reserva',
        'Error al insertar en el historial'
      ]
    },
    errorHandling: {
      handlesErrors: true,
      errorCodes: [
        { code: '45002', description: 'Reserva no encontrada' },
        { code: '45003', description: 'La reserva no está en estado pendiente' }
      ],
      strategy: 'Utiliza bloques DECLARE CONTINUE HANDLER para capturar errores específicos y establece la variable de salida p_success en FALSE'
    },
    flowDiagram: {
      steps: [
        { step: 1, description: 'Validar existencia de la reserva con el código proporcionado' },
        { step: 2, description: 'Verificar que el estado actual sea "Pending"' },
        { step: 3, description: 'Iniciar transacción' },
        { step: 4, description: 'Actualizar el estado de la reserva a "Confirmed"' },
        { step: 5, description: 'Registrar el cambio en el historial de reservas' },
        { step: 6, description: 'Confirmar transacción' },
        { step: 7, description: 'Establecer p_success a TRUE si todo es correcto' }
      ]
    },
    exampleUsages: [
      {
        description: 'Confirmar la reserva con código SL7X45Z',
        sql: "CALL sp_confirm_booking('SL7X45Z', @success);\nSELECT @success;",
        result: "+----------+\n| @success |\n+----------+\n| 1        |\n+----------+"
      }
    ]
  },
  sp_check_in_passenger: {
    name: 'sp_check_in_passenger',
    description: 'Registra el check-in de un pasajero para un vuelo específico.',
    parameters: [
      { name: 'p_ticket_id', type: 'INT', direction: 'IN', description: 'ID del ticket del pasajero' }
    ],
    tableOperations: [
      { tableName: 'checkins', operation: 'INSERT', description: 'Crea un registro de check-in para el ticket' }
    ],
    transactionInfo: { usesTransaction: false },
    errorHandling: { handlesErrors: false },
    exampleUsages: [
      { description: 'Check-in para el ticket 9876', sql: 'CALL sp_check_in_passenger(9876);' }
    ]
  },
  sp_cancel_booking: {
    name: 'sp_cancel_booking',
    description: 'Cancela una reserva existente y actualiza el historial.',
    parameters: [
      { name: 'p_booking_code', type: 'VARCHAR(8)', direction: 'IN', description: 'Código de la reserva a cancelar' }
    ],
    tableOperations: [
      { tableName: 'bookings', operation: 'UPDATE', description: 'Actualiza el estado de la reserva a "Cancelled"' },
      { tableName: 'reservations_history', operation: 'INSERT', description: 'Registra el cambio de estado en el historial' }
    ],
    transactionInfo: { usesTransaction: true, isolationLevel: 'READ COMMITTED' },
    errorHandling: { handlesErrors: true },
    exampleUsages: [
      { description: 'Cancelar la reserva con código SL7X45Z', sql: "CALL sp_cancel_booking('SL7X45Z');" }
    ]
  },
  sp_assign_crew: {
    name: 'sp_assign_crew',
    description: 'Asigna una tripulación a un vuelo específico.',
    parameters: [
      { name: 'p_flight_id', type: 'INT', direction: 'IN', description: 'ID del vuelo' },
      { name: 'p_staff_id', type: 'INT', direction: 'IN', description: 'ID del empleado' },
      { name: 'p_position', type: 'VARCHAR(20)', direction: 'IN', description: 'Posición asignada' }
    ],
    tableOperations: [
      { tableName: 'crew_assignments', operation: 'INSERT', description: 'Asigna el empleado al vuelo en la posición indicada' }
    ],
    transactionInfo: { usesTransaction: false },
    errorHandling: { handlesErrors: false },
    exampleUsages: [
      { description: 'Asignar tripulación', sql: 'CALL sp_assign_crew(123, 45, "Captain");' }
    ]
  },
  sp_add_payment: {
    name: 'sp_add_payment',
    description: 'Registra un pago para una reserva y actualiza el estado de la misma.',
    parameters: [
      { name: 'p_booking_code', type: 'CHAR(6)', direction: 'IN', description: 'Código de la reserva' },
      { name: 'p_amount', type: 'DECIMAL(10,2)', direction: 'IN', description: 'Monto del pago' },
      { name: 'p_method', type: 'VARCHAR(20)', direction: 'IN', description: 'Método de pago' }
    ],
    tableOperations: [
      { tableName: 'payments', operation: 'INSERT', description: 'Registra el pago en la tabla de pagos' },
      { tableName: 'bookings', operation: 'UPDATE', description: 'Actualiza el monto total de la reserva' }
    ],
    transactionInfo: { usesTransaction: true, isolationLevel: 'READ COMMITTED' },
    errorHandling: { handlesErrors: true },
    exampleUsages: [
      { description: 'Registrar pago', sql: "CALL sp_add_payment('SL7X45Z', 100.00, 'CreditCard');" }
    ]
  },
  sp_upgrade_seat: {
    name: 'sp_upgrade_seat',
    description: 'Actualiza la clase de tarifa de un asiento en un ticket.',
    parameters: [
      { name: 'p_ticket_id', type: 'INT', direction: 'IN', description: 'ID del ticket' },
      { name: 'p_new_fare_class_id', type: 'INT', direction: 'IN', description: 'Nueva clase de tarifa' }
    ],
    tableOperations: [
      { tableName: 'tickets', operation: 'UPDATE', description: 'Actualiza la clase de tarifa del ticket' }
    ],
    transactionInfo: { usesTransaction: false },
    errorHandling: { handlesErrors: false },
    exampleUsages: [
      { description: 'Actualizar clase de ticket', sql: 'CALL sp_upgrade_seat(555, 2);' }
    ]
  },
  sp_create_flight: {
    name: 'sp_create_flight',
    description: 'Crea un nuevo vuelo programado en el sistema.',
    parameters: [
      { name: 'p_route_id', type: 'INT', direction: 'IN', description: 'ID de la ruta' },
      { name: 'p_aircraft_id', type: 'INT', direction: 'IN', description: 'ID de la aeronave' },
      { name: 'p_departure', type: 'DATETIME', direction: 'IN', description: 'Fecha y hora de salida' },
      { name: 'p_arrival', type: 'DATETIME', direction: 'IN', description: 'Fecha y hora de llegada' },
      { name: 'p_seq', type: 'INT', direction: 'IN', description: 'Número secuencial del vuelo' }
    ],
    tableOperations: [
      { tableName: 'flights', operation: 'INSERT', description: 'Crea el registro del vuelo programado' }
    ],
    transactionInfo: { usesTransaction: true, isolationLevel: 'READ COMMITTED' },
    errorHandling: { handlesErrors: true },
    exampleUsages: [
      { description: 'Crear vuelo', sql: 'CALL sp_create_flight(1, 2, "2025-07-01 10:00:00", "2025-07-01 14:00:00", 101);' }
    ]
  },
  sp_complete_maintenance: {
    name: 'sp_complete_maintenance',
    description: 'Marca un registro de mantenimiento como completado.',
    parameters: [
      { name: 'p_log_id', type: 'INT', direction: 'IN', description: 'ID del registro de mantenimiento' }
    ],
    tableOperations: [
      { tableName: 'maintenance_logs', operation: 'UPDATE', description: 'Actualiza el estado del mantenimiento a "Completed"' }
    ],
    transactionInfo: { usesTransaction: false },
    errorHandling: { handlesErrors: false },
    exampleUsages: [
      { description: 'Completar mantenimiento', sql: 'CALL sp_complete_maintenance(123);' }
    ]
  },
  sp_generate_daily_report: {
    name: 'sp_generate_daily_report',
    description: 'Genera un reporte diario de ingresos por vuelo.',
    parameters: [],
    tableOperations: [
      { tableName: 'tickets', operation: 'SELECT', description: 'Consulta los ingresos diarios por vuelo' }
    ],
    transactionInfo: { usesTransaction: false },
    errorHandling: { handlesErrors: false },
    exampleUsages: [
      { description: 'Generar reporte diario', sql: 'CALL sp_generate_daily_report();' }
    ]
  }
};
