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
  }
};
