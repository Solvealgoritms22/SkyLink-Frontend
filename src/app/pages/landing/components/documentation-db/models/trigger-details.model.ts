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
    description: 'Genera automáticamente una tarjeta de embarque cuando un pasajero realiza el check-in para simplificar el proceso de embarque.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'checkins',
    tableDescription: 'Tabla que registra los check-ins de pasajeros para sus vuelos',
    affectedTables: [
      {
        name: 'boarding_passes',
        columns: [
          { name: 'checkin_id', usedFor: 'Asocia la tarjeta de embarque con el check-in realizado' },
          { name: 'gate', usedFor: 'Almacena la puerta de embarque (inicialmente "TBD" - Por Determinar)' },
          { name: 'boarding_time', usedFor: 'Establece la hora de embarque (30 minutos después del check-in)' },
          { name: 'seat_number', usedFor: 'Asigna el número de asiento del pasajero' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'NEW.checkin_id',
        description: 'ID del check-in que acaba de ser registrado',
        example: '4578'
      },
      {
        name: 'NEW.ticket_id',
        description: 'ID del ticket asociado al check-in',
        example: '9876'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Check-in de un pasajero',
        sql: "INSERT INTO checkins (ticket_id, baggage_count) VALUES (9876, 2)",
        effect: "Se genera automáticamente una tarjeta de embarque con puerta 'TBD', hora de embarque y el asiento asignado al pasajero"
      },
      {
        description: 'Check-in desde la aplicación móvil',
        sql: "CALL sp_check_in_passenger(9876)",
        effect: "El procedimiento inserta un registro en checkins, activando el trigger que genera la tarjeta de embarque"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se registra un nuevo check-in en la tabla checkins' },
        { step: 2, description: 'Se recupera la información del boleto asociado al check-in' },
        { step: 3, description: 'Se calcula la hora de embarque (30 minutos después)' },
        { step: 4, description: 'Se crea una nueva tarjeta de embarque en la tabla boarding_passes' }
      ]
    },
    businessRules: [
      'Cada check-in debe generar exactamente una tarjeta de embarque',
      'Las tarjetas de embarque inicialmente tienen la puerta como "TBD" hasta asignación',
      'La hora de embarque se establece por defecto 30 minutos después del check-in',
      'El número de asiento se conserva del ticket original'
    ]
  },
  trg_after_ticket_insert: {
    name: 'trg_after_ticket_insert',
    description: 'Actualiza automáticamente el inventario de asientos cuando se emite un nuevo boleto para mantener el control de asientos disponibles.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'tickets',
    tableDescription: 'Tabla que almacena los boletos emitidos para los vuelos',
    affectedTables: [
      {
        name: 'seat_inventory',
        columns: [
          { name: 'seats_sold', usedFor: 'Se incrementa en 1 cada vez que se emite un nuevo boleto' },
          { name: 'flight_id', usedFor: 'Identificador del vuelo al que corresponde el boleto' },
          { name: 'fare_class_id', usedFor: 'Identificador de la clase de tarifa del boleto' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'NEW.flight_id',
        description: 'ID del vuelo para el cual se está emitiendo el boleto',
        example: '534'
      },
      {
        name: 'NEW.fare_class_id',
        description: 'ID de la clase de tarifa del boleto (Económica, Business, Primera)',
        example: '2'
      },
      {
        name: 'NEW.seat_number',
        description: 'Número de asiento asignado al boleto',
        example: '24B'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Emisión de un nuevo boleto',
        sql: "INSERT INTO tickets (flight_id, passenger_id, fare_class_id, seat_number, price_paid) VALUES (534, 87, 2, '24B', 450.50)",
        effect: "Se incrementa el contador de asientos vendidos para el vuelo 534 en la clase de tarifa 2"
      },
      {
        description: 'Conversión de reserva en boleto',
        sql: "CALL sp_issue_ticket(1234, '15A')",
        effect: "El procedimiento inserta un registro en tickets, activando el trigger que actualiza el inventario de asientos"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se registra un nuevo boleto en la tabla tickets' },
        { step: 2, description: 'Se identifica el vuelo y la clase de tarifa del boleto emitido' },
        { step: 3, description: 'Se incrementa el contador de asientos vendidos en la tabla seat_inventory' },
        { step: 4, description: 'Se completa la operación de inserción en la tabla tickets' }
      ]
    },
    businessRules: [
      'Cada nuevo boleto emitido debe reducir la disponibilidad de asientos',
      'El inventario de asientos debe mantenerse actualizado en tiempo real',
      'La cuenta de asientos vendidos nunca debe exceder el total de asientos disponibles',
      'Se debe llevar control separado por vuelo y clase de tarifa'
    ]
  },
  trg_after_ticket_delete: {
    name: 'trg_after_ticket_delete',
    description: 'Actualiza automáticamente el inventario de asientos cuando se elimina un boleto para liberar el asiento para su reventa.',
    triggerTiming: 'AFTER',
    triggerEvent: 'DELETE',
    tableName: 'tickets',
    tableDescription: 'Tabla que almacena los boletos emitidos para los vuelos',
    affectedTables: [
      {
        name: 'seat_inventory',
        columns: [
          { name: 'seats_sold', usedFor: 'Se decrementa en 1 cada vez que se elimina un boleto' },
          { name: 'flight_id', usedFor: 'Identificador del vuelo al que corresponde el boleto eliminado' },
          { name: 'fare_class_id', usedFor: 'Identificador de la clase de tarifa del boleto eliminado' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'OLD.flight_id',
        description: 'ID del vuelo del boleto que está siendo eliminado',
        example: '534'
      },
      {
        name: 'OLD.fare_class_id',
        description: 'ID de la clase de tarifa del boleto eliminado',
        example: '2'
      },
      {
        name: 'OLD.seat_number',
        description: 'Número de asiento que se está liberando',
        example: '24B'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Cancelación de un boleto',
        sql: "DELETE FROM tickets WHERE ticket_id = 5678",
        effect: "Se decrementa el contador de asientos vendidos para el vuelo correspondiente en la clase de tarifa indicada"
      },
      {
        description: 'Cancelación masiva por vuelo cancelado',
        sql: "DELETE FROM tickets WHERE flight_id = 534",
        effect: "El trigger se ejecuta múltiples veces, una por cada boleto eliminado, actualizando el inventario cada vez"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se elimina un boleto de la tabla tickets' },
        { step: 2, description: 'Se identifica el vuelo y la clase de tarifa del boleto eliminado' },
        { step: 3, description: 'Se decrementa el contador de asientos vendidos en la tabla seat_inventory' },
        { step: 4, description: 'Se completa la operación de eliminación en la tabla tickets' }
      ]
    },
    businessRules: [
      'Cada boleto eliminado debe liberar un asiento en el inventario',
      'El inventario de asientos debe actualizarse inmediatamente tras la eliminación',
      'La cuenta de asientos vendidos nunca debe ser negativa',
      'Se debe liberar el asiento incluso si la eliminación es parte de un cambio de vuelo o clase'
    ]
  },
  trg_after_maintenance_insert: {
    name: 'trg_after_maintenance_insert',
    description: 'Actualiza automáticamente el estado de los vuelos a "Mantenimiento" cuando se registra un mantenimiento para una aeronave.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'maintenance_logs',
    tableDescription: 'Tabla que registra las actividades de mantenimiento programadas o en curso para las aeronaves',
    affectedTables: [
      {
        name: 'flights',
        columns: [
          { name: 'status', usedFor: 'Se actualiza a "Maintenance" para los vuelos afectados' },
          { name: 'aircraft_id', usedFor: 'Identificador de la aeronave bajo mantenimiento' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'NEW.aircraft_id',
        description: 'ID de la aeronave para la cual se está registrando el mantenimiento',
        example: '12'
      },
      {
        name: 'NEW.maintenance_type',
        description: 'Tipo de mantenimiento que se está registrando',
        example: '"Routine"'
      },
      {
        name: 'NEW.estimated_completion',
        description: 'Fecha y hora estimada de finalización del mantenimiento',
        example: '2025-06-15 14:30:00'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Registro de un nuevo mantenimiento rutinario',
        sql: "INSERT INTO maintenance_logs (aircraft_id, maintenance_type, description, scheduled_date, status) VALUES (12, 'Routine', 'Inspección de sistemas', CURRENT_DATE, 'Scheduled')",
        effect: "Se actualiza el estado de todos los vuelos programados con la aeronave 12 a 'Maintenance'"
      },
      {
        description: 'Registro de un mantenimiento de emergencia',
        sql: "INSERT INTO maintenance_logs (aircraft_id, maintenance_type, description, scheduled_date, status) VALUES (12, 'Emergency', 'Fallo en sistema hidráulico', CURRENT_DATE, 'In Progress')",
        effect: "Se actualiza el estado de todos los vuelos programados con la aeronave 12 a 'Maintenance'"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se registra una nueva entrada de mantenimiento en maintenance_logs' },
        { step: 2, description: 'Se identifica la aeronave afectada por el mantenimiento' },
        { step: 3, description: 'Se actualizan todos los vuelos programados con esa aeronave a estado "Maintenance"' },
        { step: 4, description: 'Se completa la operación de inserción en la tabla maintenance_logs' }
      ]
    },
    businessRules: [
      'Todos los vuelos de una aeronave en mantenimiento deben marcarse como afectados',
      'La actualización del estado de los vuelos debe ser automática al registrar un mantenimiento',
      'No hay distinción entre tipos de mantenimiento; todos afectan los vuelos por igual',
      'Los vuelos se mantienen en estado "Maintenance" hasta que se complete el mantenimiento'
    ]
  },
  trg_after_maintenance_complete: {
    name: 'trg_after_maintenance_complete',
    description: 'Restaura automáticamente el estado de los vuelos a "Programado" cuando se completa un mantenimiento de aeronave.',
    triggerTiming: 'AFTER',
    triggerEvent: 'UPDATE',
    tableName: 'maintenance_logs',
    tableDescription: 'Tabla que registra las actividades de mantenimiento programadas o en curso para las aeronaves',
    affectedTables: [
      {
        name: 'flights',
        columns: [
          { name: 'status', usedFor: 'Se actualiza a "Scheduled" cuando el mantenimiento se completa' },
          { name: 'aircraft_id', usedFor: 'Identificador de la aeronave que ha finalizado mantenimiento' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'OLD.status',
        description: 'Estado anterior del mantenimiento antes de la actualización',
        example: '"In Progress"'
      },
      {
        name: 'NEW.status',
        description: 'Nuevo estado del mantenimiento después de la actualización',
        example: '"Completed"'
      },
      {
        name: 'NEW.aircraft_id',
        description: 'ID de la aeronave que ha terminado mantenimiento',
        example: '12'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Finalización de un mantenimiento',
        sql: "UPDATE maintenance_logs SET status = 'Completed', completion_notes = 'Sistemas verificados y operativos' WHERE log_id = 345",
        effect: "Se restaura el estado de todos los vuelos con la aeronave afectada de 'Maintenance' a 'Scheduled'"
      },
      {
        description: 'Finalización de mantenimiento mediante procedimiento',
        sql: "CALL sp_complete_maintenance(345)",
        effect: "El procedimiento actualiza el estado del mantenimiento, activando el trigger que restaura el estado de los vuelos"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se actualiza un registro de mantenimiento a estado "Completed"' },
        { step: 2, description: 'Se verifica que el estado anterior no fuera ya "Completed"' },
        { step: 3, description: 'Se identifica la aeronave asociada al mantenimiento completado' },
        { step: 4, description: 'Se actualizan todos los vuelos en estado "Maintenance" a "Scheduled" para esa aeronave' }
      ]
    },
    businessRules: [
      'Solo se restauran los vuelos cuando el mantenimiento cambia a estado "Completed"',
      'Solo se afectan los vuelos que estén actualmente en estado "Maintenance"',
      'La actualización del estado de los vuelos debe ser automática al completar un mantenimiento',
      'Si hay múltiples mantenimientos para una aeronave, completar uno solo restaurará los vuelos si no hay otros activos'
    ]
  },
  trg_after_loyalty_transaction: {
    name: 'trg_after_loyalty_transaction',
    description: 'Actualiza automáticamente el balance de puntos de lealtad del pasajero cuando se registra una nueva transacción de puntos.',
    triggerTiming: 'AFTER',
    triggerEvent: 'INSERT',
    tableName: 'booking_passengers',
    tableDescription: 'Tabla de relación entre reservas y pasajeros que incluye los puntos de lealtad otorgados',
    affectedTables: [
      {
        name: 'loyalty_programs',
        columns: [
          { name: 'points_balance', usedFor: 'Se incrementa con los puntos otorgados en la nueva transacción' },
          { name: 'passenger_id', usedFor: 'Identificador del pasajero cuyo balance de puntos se actualiza' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'NEW.passenger_id',
        description: 'ID del pasajero que recibe los puntos de lealtad',
        example: '456'
      },
      {
        name: 'NEW.loyalty_points_awarded',
        description: 'Cantidad de puntos otorgados en la transacción',
        example: '1500'
      },
      {
        name: 'NEW.booking_id',
        description: 'ID de la reserva asociada a la transacción de puntos',
        example: '7890'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Registro de un pasajero en una reserva con puntos',
        sql: "INSERT INTO booking_passengers (booking_id, passenger_id, fare_class_id, loyalty_points_awarded) VALUES (7890, 456, 2, 1500)",
        effect: "Se incrementa el balance de puntos del pasajero 456 en 1500 puntos en la tabla loyalty_programs"
      },
      {
        description: 'Actualización de puntos por promoción',
        sql: "UPDATE booking_passengers SET loyalty_points_awarded = 3000 WHERE booking_id = 7890 AND passenger_id = 456",
        effect: "Este trigger no se activaría ya que solo responde a inserciones, no a actualizaciones"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se registra una nueva relación entre reserva y pasajero en booking_passengers' },
        { step: 2, description: 'Se verifica la cantidad de puntos otorgados en la transacción' },
        { step: 3, description: 'Se actualiza el balance de puntos del pasajero en la tabla loyalty_programs' },
        { step: 4, description: 'Se completa la operación de inserción en la tabla booking_passengers' }
      ]
    },
    businessRules: [
      'Cada transacción de puntos debe reflejarse inmediatamente en el balance del pasajero',
      'Solo se actualizan los puntos en inserciones, no en actualizaciones posteriores',
      'El pasajero debe estar previamente registrado en el programa de lealtad',
      'No hay restricciones sobre la cantidad de puntos que se pueden otorgar por transacción'
    ]
  },
  trg_flight_status_update: {
    name: 'trg_flight_status_update',
    description: 'Registra automáticamente cada cambio de estado de un vuelo en el historial para mantener una trazabilidad completa de cambios.',
    triggerTiming: 'AFTER',
    triggerEvent: 'UPDATE',
    tableName: 'flights',
    tableDescription: 'Tabla principal de vuelos que incluye el estado actual de cada vuelo',
    affectedTables: [
      {
        name: 'flight_status_history',
        columns: [
          { name: 'flight_id', usedFor: 'Identifica el vuelo cuyo estado ha cambiado' },
          { name: 'status', usedFor: 'Almacena el nuevo estado del vuelo' },
          { name: 'changed_at', usedFor: 'Registra automáticamente la fecha y hora del cambio' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'OLD.status',
        description: 'Estado anterior del vuelo antes de la actualización',
        example: '"Scheduled"'
      },
      {
        name: 'NEW.status',
        description: 'Nuevo estado del vuelo después de la actualización',
        example: '"Boarding"'
      },
      {
        name: 'NEW.flight_id',
        description: 'ID del vuelo cuyo estado está cambiando',
        example: '789'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Actualización de estado de vuelo a Embarcando',
        sql: "UPDATE flights SET status = 'Boarding' WHERE flight_id = 789",
        effect: "Se crea un nuevo registro en flight_status_history con el vuelo 789 y estado 'Boarding'"
      },
      {
        description: 'Actualización automática por evento programado',
        sql: "UPDATE flights SET status = 'Departed' WHERE status = 'Boarding' AND departure_time <= NOW()",
        effect: "Se crean múltiples registros en flight_status_history, uno por cada vuelo actualizado"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se actualiza el estado de un vuelo en la tabla flights' },
        { step: 2, description: 'Se compara el nuevo estado con el estado anterior' },
        { step: 3, description: 'Si son diferentes, se crea un registro en flight_status_history' },
        { step: 4, description: 'Se completa la operación de actualización en la tabla flights' }
      ]
    },
    businessRules: [
      'Todos los cambios de estado de vuelos deben quedar registrados en el historial',
      'Solo se registran cambios reales (cuando el nuevo estado es diferente al anterior)',
      'Cada cambio debe incluir el timestamp exacto en que ocurrió',
      'El historial debe mantenerse incluso para vuelos que cambien de estado múltiples veces'
    ]
  },
  trg_audit_delete_booking: {
    name: 'trg_audit_delete_booking',
    description: 'Registra en la tabla de auditoría cuando se elimina una reserva del sistema para mantener trazabilidad de todas las eliminaciones.',
    triggerTiming: 'AFTER',
    triggerEvent: 'DELETE',
    tableName: 'bookings',
    tableDescription: 'Tabla principal de reservas donde se almacenan los datos de las reservas de vuelos',
    affectedTables: [
      {
        name: 'audit_logs',
        columns: [
          { name: 'table_name', usedFor: 'Registra el nombre de la tabla afectada ("bookings")' },
          { name: 'operation', usedFor: 'Registra el tipo de operación realizada ("DELETE")' },
          { name: 'record_id', usedFor: 'Almacena el ID de la reserva eliminada' },
          { name: 'changed_by', usedFor: 'Registra el usuario que ejecutó la eliminación (USER())' },
          { name: 'modified_at', usedFor: 'Registra automáticamente la fecha y hora de la eliminación' }
        ]
      }
    ],
    specialVariables: [
      {
        name: 'OLD.booking_id',
        description: 'ID de la reserva que está siendo eliminada',
        example: '5678'
      },
      {
        name: 'OLD.booking_code',
        description: 'Código de la reserva eliminada',
        example: '"SL3A7B"'
      },
      {
        name: 'OLD.status',
        description: 'Estado que tenía la reserva antes de ser eliminada',
        example: '"Cancelled"'
      }
    ],
    exampleTriggeringOperations: [
      {
        description: 'Eliminación manual de una reserva',
        sql: "DELETE FROM bookings WHERE booking_id = 5678",
        effect: "Se crea un registro en audit_logs con la operación DELETE y el ID de la reserva eliminada"
      },
      {
        description: 'Limpieza automática de reservas expiradas',
        sql: "DELETE FROM bookings WHERE status = 'Pending' AND booking_date < DATE_SUB(NOW(), INTERVAL 24 HOUR)",
        effect: "Se crean múltiples registros en audit_logs, uno por cada reserva eliminada en la operación"
      }
    ],
    flowDiagram: {
      steps: [
        { step: 1, description: 'Se elimina una reserva de la tabla bookings' },
        { step: 2, description: 'Se capturan los datos relevantes de la reserva antes de su eliminación' },
        { step: 3, description: 'Se crea un registro en la tabla audit_logs con la información de la eliminación' },
        { step: 4, description: 'Se completa la operación de eliminación en la tabla bookings' }
      ]
    },
    businessRules: [
      'Todas las eliminaciones de reservas deben ser auditadas sin excepción',
      'Se debe registrar quién realizó la eliminación para fines de seguridad',
      'La auditoría debe realizarse incluso para eliminaciones masivas o automatizadas',
      'La información básica de la reserva eliminada debe preservarse en los logs'
    ]
  }
};
