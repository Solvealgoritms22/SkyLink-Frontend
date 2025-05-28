/**
 * Modelo de datos detallados para triggers SQL
 */

export interface TriggerTable {
  name: string;
  columns: {
    name: string;
    usedFor?: string;
  }[];
}

export interface TriggerDetail {
  name: string;
  description: string;
  triggerTiming: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
  triggerEvent: 'INSERT' | 'UPDATE' | 'DELETE' | 'INSERT,UPDATE' | 'INSERT,DELETE' | 'UPDATE,DELETE' | 'INSERT,UPDATE,DELETE';
  tableName: string;
  tableDescription: string;
  affectedTables: TriggerTable[];
  specialVariables: {
    name: string;
    description: string;
    example?: string;
  }[];
  exampleTriggeringOperations: {
    description: string;
    sql: string;
    effect: string;
  }[];
  flowDiagram?: {
    steps: {
      step: number;
      description: string;
      code?: string;
    }[];
  };
  businessRules: string[];
}

export const triggerDetails: { [key: string]: TriggerDetail } = {
  trg_after_booking_confirm: {
    name: 'trg_after_booking_confirm',
    description: 'Registra en la tabla de auditoría cuando se confirma una reserva para mantener un historial completo de cambios de estado.',
    triggerTiming: 'AFTER',
    triggerEvent: 'UPDATE',
    tableName: 'bookings',
    tableDescription: 'Tabla principal de reservas donde se almacenan todos los datos de reserva incluyendo el estado actual',
    affectedTables: [
      {
        name: 'audit_logs',
        columns: [
          { name: 'table_name', usedFor: 'Almacena el nombre de la tabla afectada ("bookings")' },
          { name: 'operation', usedFor: 'Almacena el tipo de operación realizada ("UPDATE")' },
          { name: 'record_id', usedFor: 'Almacena el ID de la reserva modificada' },
          { name: 'field_name', usedFor: 'Almacena el nombre del campo modificado ("status")' },
          { name: 'old_value', usedFor: 'Almacena el valor anterior del estado de la reserva' },
          { name: 'new_value', usedFor: 'Almacena el nuevo valor del estado de la reserva ("Confirmed")' },
          { name: 'modified_by', usedFor: 'Almacena el usuario que realizó el cambio (USER())' },
          { name: 'modified_at', usedFor: 'Almacena la fecha y hora del cambio (CURRENT_TIMESTAMP)' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'OLD.status',
        description: 'Valor anterior del campo status antes de la actualización',
        example: '"Pending"'
      },
      {
        name: 'NEW.status',
        description: 'Nuevo valor del campo status después de la actualización',
        example: '"Confirmed"'
      },
      {
        name: 'OLD.booking_id',
        description: 'ID de la reserva que está siendo actualizada',
        example: '1234'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Confirmación manual de una reserva',
        sql: "UPDATE bookings SET status = 'Confirmed' WHERE booking_code = 'SL7X45Z'",
        effect: "Se inserta un registro en audit_logs con los detalles del cambio de estado de 'Pending' a 'Confirmed'"
      },
      {
        description: 'Confirmación automática al procesar un pago',
        sql: "CALL sp_add_payment('SL7X45Z', '5432-XXXX-XXXX-1234', 'Credit', 1250.75)",
        effect: "El procedimiento actualiza la reserva, activando el trigger que inserta un registro en audit_logs"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se detecta una actualización en la tabla bookings' },
        { step: 2, description: 'Se verifica si el campo status fue modificado a "Confirmed"' },
        { step: 3, description: 'Se crea un registro en la tabla audit_logs con los detalles del cambio' },
        { step: 4, description: 'Se completa la operación de actualización en la tabla bookings' }
      ]
    },
    businessRules: [
      'Todas las confirmaciones de reservas deben ser auditadas',
      'Se debe mantener el historial de quién realizó cada cambio de estado',
      'Los cambios a otros estados diferentes de "Confirmed" no activan este trigger'
    ]
  },
  trg_after_payment_insert: {
    name: 'trg_after_payment_insert',
    description: 'Confirma automáticamente una reserva cuando se registra un pago exitoso para agilizar el proceso de reserva.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'payments',
    tableDescription: 'Tabla que almacena los registros de pagos realizados para las reservas',
    affectedTables: [
      {
        name: 'bookings',
        columns: [
          { name: 'status', usedFor: 'Se actualiza a "Confirmed" cuando el pago es exitoso' },
          { name: 'updated_at', usedFor: 'Se actualiza a la fecha y hora actual' }
        ]
      },
      {
        name: 'reservations_history',
        columns: [
          { name: 'booking_id', usedFor: 'ID de la reserva que se está confirmando' },
          { name: 'status', usedFor: 'Nuevo estado "Confirmed"' },
          { name: 'changed_at', usedFor: 'Fecha y hora del cambio' },
          { name: 'changed_by', usedFor: 'Usuario que realizó el cambio (a través del pago)' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'NEW.booking_id',
        description: 'ID de la reserva asociada al pago insertado',
        example: '1234'
      },
      {
        name: 'NEW.status',
        description: 'Estado del pago insertado',
        example: '"Approved"'
      },
      {
        name: 'NEW.amount',
        description: 'Monto del pago procesado',
        example: '1250.75'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Inserción de un pago aprobado',
        sql: "INSERT INTO payments (booking_id, payment_method, amount, status) VALUES (1234, 'Credit Card', 1250.75, 'Approved')",
        effect: "Se actualiza la reserva 1234 a estado 'Confirmed' y se crea un registro en el historial"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se inserta un nuevo registro en la tabla payments' },
        { step: 2, description: 'Se verifica que el estado del pago sea "Approved"' },
        { step: 3, description: 'Se obtiene el ID de la reserva asociada al pago' },
        { step: 4, description: 'Se actualiza el estado de la reserva a "Confirmed" en la tabla bookings' },
        { step: 5, description: 'Se crea un registro en el historial de cambios de estado de reservas' }
      ]
    },
    businessRules: [
      'Solo se confirman reservas cuando el pago está en estado "Approved"',
      'Una reserva ya confirmada no se modifica si recibe pagos adicionales',
      'Se registra el cambio de estado en el historial para auditoría'
    ]
  },
  trg_checkin_auto_bp: {
    name: 'trg_checkin_auto_bp',
    description: 'Genera automáticamente una tarjeta de embarque cuando un pasajero hace check-in.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'checkins',
    tableDescription: 'Registra el check-in de pasajeros.',
    affectedTables: [
      { name: 'boarding_passes', columns: [ { name: 'checkin_id', usedFor: 'ID del check-in' }, { name: 'gate', usedFor: 'Puerta asignada' }, { name: 'boarding_time', usedFor: 'Hora de abordaje' }, { name: 'seat_number', usedFor: 'Número de asiento' } ] }
    ],
    specialVariables: [
      { name: 'NEW.checkin_id', description: 'ID del check-in insertado', example: '1001' },
      { name: 'NEW.ticket_id', description: 'ID del ticket asociado', example: '2001' }
    ],
    exampleTriggeringOperations: [
      { description: 'Check-in realizado', sql: "INSERT INTO checkins (ticket_id, checkin_time) VALUES (2001, NOW())", effect: "Se genera una tarjeta de embarque para el pasajero." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se inserta un check-in' }, { step: 2, description: 'Se genera la tarjeta de embarque' } ] },
    businessRules: [ 'Cada check-in debe generar una tarjeta de embarque asociada.' ]
  },
  trg_after_ticket_insert: {
    name: 'trg_after_ticket_insert',
    description: 'Actualiza el inventario de asientos cuando se crea un nuevo boleto.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'tickets',
    tableDescription: 'Boletos emitidos para vuelos.',
    affectedTables: [
      { name: 'seat_inventory', columns: [ { name: 'seats_sold', usedFor: 'Incrementa en 1' } ] }
    ],
    specialVariables: [
      { name: 'NEW.flight_id', description: 'ID del vuelo', example: '101' },
      { name: 'NEW.fare_class_id', description: 'ID de la clase de tarifa', example: '1' } ],
    exampleTriggeringOperations: [
      { description: 'Emisión de boleto', sql: "INSERT INTO tickets (flight_id, fare_class_id, ...) VALUES (101, 1, ...)" , effect: "Se incrementa seats_sold en seat_inventory." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se inserta un ticket' }, { step: 2, description: 'Se actualiza seat_inventory' } ] },
    businessRules: [ 'El inventario de asientos debe reflejar la venta de cada boleto.' ]
  },
  trg_after_ticket_delete: {
    name: 'trg_after_ticket_delete',
    description: 'Actualiza el inventario de asientos cuando se elimina un boleto.',
    triggerTiming: 'AFTER',
    triggerEvent: 'DELETE',
    tableName: 'tickets',
    tableDescription: 'Boletos emitidos para vuelos.',
    affectedTables: [
      { name: 'seat_inventory', columns: [ { name: 'seats_sold', usedFor: 'Decrementa en 1' } ] }
    ],
    specialVariables: [
      { name: 'OLD.flight_id', description: 'ID del vuelo', example: '101' },
      { name: 'OLD.fare_class_id', description: 'ID de la clase de tarifa', example: '1' } ],
    exampleTriggeringOperations: [
      { description: 'Eliminación de boleto', sql: "DELETE FROM tickets WHERE ticket_id = 3001", effect: "Se decrementa seats_sold en seat_inventory." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se elimina un ticket' }, { step: 2, description: 'Se actualiza seat_inventory' } ] },
    businessRules: [ 'El inventario de asientos debe reflejar la cancelación de cada boleto.' ]
  },
  trg_after_maintenance_insert: {
    name: 'trg_after_maintenance_insert',
    description: 'Cambia el estado de los vuelos a "Mantenimiento" cuando se programa un mantenimiento para la aeronave.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'maintenance_logs',
    tableDescription: 'Registros de mantenimiento de aeronaves.',
    affectedTables: [
      { name: 'flights', columns: [ { name: 'status', usedFor: 'Actualiza a "Maintenance"' } ] }
    ],
    specialVariables: [
      { name: 'NEW.aircraft_id', description: 'ID de la aeronave', example: 'A320-01' } ],
    exampleTriggeringOperations: [
      { description: 'Registro de mantenimiento', sql: "INSERT INTO maintenance_logs (aircraft_id, ...) VALUES ('A320-01', ...)" , effect: "Se actualizan vuelos a estado Maintenance." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se inserta un registro de mantenimiento' }, { step: 2, description: 'Se actualizan vuelos afectados' } ] },
    businessRules: [ 'Ningún vuelo debe estar programado durante mantenimiento.' ]
  },
  trg_after_maintenance_complete: {
    name: 'trg_after_maintenance_complete',
    description: 'Restaura el estado de los vuelos a "Programado" cuando se completa el mantenimiento de la aeronave.',
    triggerTiming: 'AFTER',
    triggerEvent: 'UPDATE',
    tableName: 'maintenance_logs',
    tableDescription: 'Registros de mantenimiento de aeronaves.',
    affectedTables: [
      { name: 'flights', columns: [ { name: 'status', usedFor: 'Actualiza a "Scheduled"' } ] }
    ],
    specialVariables: [
      { name: 'NEW.aircraft_id', description: 'ID de la aeronave', example: 'A320-01' },
      { name: 'NEW.status', description: 'Estado del mantenimiento', example: 'Completed' } ],
    exampleTriggeringOperations: [
      { description: 'Completar mantenimiento', sql: "UPDATE maintenance_logs SET status = 'Completed' WHERE log_id = 5001", effect: "Se restauran vuelos a estado Scheduled." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se actualiza el registro de mantenimiento' }, { step: 2, description: 'Se restauran vuelos afectados' } ] },
    businessRules: [ 'Los vuelos deben reprogramarse tras el mantenimiento.' ]
  },
  trg_after_loyalty_transaction: {
    name: 'trg_after_loyalty_transaction',
    description: 'Actualiza el balance de puntos de lealtad cuando se registran nuevos puntos.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'booking_passengers',
    tableDescription: 'Pasajeros asociados a reservas.',
    affectedTables: [
      { name: 'loyalty_programs', columns: [ { name: 'points_balance', usedFor: 'Incrementa según puntos otorgados' } ] }
    ],
    specialVariables: [
      { name: 'NEW.passenger_id', description: 'ID del pasajero', example: '101' },
      { name: 'NEW.loyalty_points_awarded', description: 'Puntos otorgados', example: '250' } ],
    exampleTriggeringOperations: [
      { description: 'Otorgar puntos de lealtad', sql: "INSERT INTO booking_passengers (passenger_id, loyalty_points_awarded) VALUES (101, 250)", effect: "Se incrementan los puntos en loyalty_programs." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se inserta booking_passenger' }, { step: 2, description: 'Se actualiza loyalty_programs' } ] },
    businessRules: [ 'Cada reserva puede otorgar puntos de lealtad.' ]
  },
  trg_flight_status_update: {
    name: 'trg_flight_status_update',
    description: 'Registra en el historial cada cambio de estado de un vuelo.',
    triggerTiming: 'AFTER',
    triggerEvent: 'UPDATE',
    tableName: 'flights',
    tableDescription: 'Vuelos programados.',
    affectedTables: [
      { name: 'flight_status_history', columns: [ { name: 'flight_id', usedFor: 'ID del vuelo' }, { name: 'status', usedFor: 'Nuevo estado' } ] }
    ],
    specialVariables: [
      { name: 'NEW.flight_id', description: 'ID del vuelo', example: '101' },
      { name: 'NEW.status', description: 'Nuevo estado', example: 'Departed' },
      { name: 'OLD.status', description: 'Estado anterior', example: 'Scheduled' } ],
    exampleTriggeringOperations: [
      { description: 'Actualizar estado de vuelo', sql: "UPDATE flights SET status = 'Departed' WHERE flight_id = 101", effect: "Se registra el cambio en flight_status_history." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se actualiza el estado del vuelo' }, { step: 2, description: 'Se inserta en flight_status_history' } ] },
    businessRules: [ 'Cada cambio de estado debe quedar registrado.' ]
  },
  trg_audit_delete_booking: {
    name: 'trg_audit_delete_booking',
    description: 'Registra en la auditoría cuando se elimina una reserva del sistema.',
    triggerTiming: 'AFTER',
    triggerEvent: 'DELETE',
    tableName: 'bookings',
    tableDescription: 'Reservas registradas.',
    affectedTables: [
      { name: 'audit_logs', columns: [ { name: 'table_name', usedFor: 'Nombre de la tabla afectada' }, { name: 'operation', usedFor: 'Tipo de operación' }, { name: 'record_id', usedFor: 'ID de la reserva eliminada' }, { name: 'changed_by', usedFor: 'Usuario que realizó la eliminación' } ] }
    ],
    specialVariables: [
      { name: 'OLD.booking_id', description: 'ID de la reserva eliminada', example: '1234' } ],
    exampleTriggeringOperations: [
      { description: 'Eliminar reserva', sql: "DELETE FROM bookings WHERE booking_id = 1234", effect: "Se inserta registro en audit_logs." }
    ],
    flowDiagram: { steps: [ { step: 1, description: 'Se elimina la reserva' }, { step: 2, description: 'Se inserta en audit_logs' } ] },
    businessRules: [ 'Toda eliminación debe ser auditada.' ]
  }
};
