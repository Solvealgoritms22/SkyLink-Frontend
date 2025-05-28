/**
 * Modelo de datos detallados para eventos SQL
 */

export interface EventSchedule {
  type: 'ONE TIME' | 'RECURRING';
  interval?: {
    value: number;
    unit: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  };
  startTime?: string;
  endTime?: string;
  specificTime?: string;
}

export interface EventAffectedTable {
  name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  description: string;
  estimatedRecords?: string;
}

export interface EventExecutionHistory {
  date: string;
  status: 'SUCCESS' | 'FAILURE' | 'PARTIAL SUCCESS';
  recordsProcessed?: number;
  duration?: string;
  error?: string;
}

export interface EventDetail {
  name: string;
  description: string;
  schedule: EventSchedule;
  affectedTables: EventAffectedTable[];
  executionHistory?: EventExecutionHistory[];
  preservationPolicy?: {
    dataRetention: string;
    archiving: boolean;
    archiveDestination?: string;
  };
  maintenanceNotes: string[];
  businessImpact: string;
  performanceConsiderations: string[];
  exampleResults?: {
    description: string;
    result: string;
  };
}

export const eventDetails: { [key: string]: EventDetail } = {
  ev_archive_old_flights: {
    name: 'ev_archive_old_flights',
    description: 'Archiva información de vuelos completados con más de un año de antigüedad para mantener optimizado el rendimiento de la base de datos activa.',
    schedule: {
      type: 'RECURRING',
      interval: {
        value: 1,
        unit: 'MONTH'
      },
      specificTime: '02:00:00' // 2 AM
    },
    affectedTables: [
      {
        name: 'flights',
        operation: 'SELECT',
        description: 'Lee los vuelos con fecha de llegada anterior a hace un año',
        estimatedRecords: '~1,000 por mes'
      },
      {
        name: 'archived_flights',
        operation: 'INSERT',
        description: 'Inserta los registros de vuelos antiguos en la tabla de archivo',
        estimatedRecords: '~1,000 por mes'
      },
      {
        name: 'tickets',
        operation: 'SELECT',
        description: 'Lee los tickets asociados a vuelos antiguos',
        estimatedRecords: '~5,000 por mes'
      },
      {
        name: 'archived_tickets',
        operation: 'INSERT',
        description: 'Inserta los tickets en la tabla de archivo',
        estimatedRecords: '~5,000 por mes'
      },
      {
        name: 'flights',
        operation: 'DELETE',
        description: 'Elimina los vuelos ya archivados',
        estimatedRecords: '~1,000 por mes'
      },
      {
        name: 'tickets',
        operation: 'DELETE',
        description: 'Elimina los tickets ya archivados',
        estimatedRecords: '~5,000 por mes'
      }
    ],
    executionHistory: [
      {
        date: '2025-04-01 02:00:00',
        status: 'SUCCESS',
        recordsProcessed: 986,
        duration: '01:45:22'
      },
      {
        date: '2025-03-01 02:00:00',
        status: 'SUCCESS',
        recordsProcessed: 1023,
        duration: '01:52:14'
      },
      {
        date: '2025-02-01 02:00:00',
        status: 'PARTIAL SUCCESS',
        recordsProcessed: 945,
        duration: '02:30:10',
        error: 'Timeout on DELETE operation, process continued on next run'
      }
    ],
    preservationPolicy: {
      dataRetention: 'Los datos archivados se mantienen por 7 años',
      archiving: true,
      archiveDestination: 'Tabla archived_flights y archived_tickets con compresión de datos'
    },
    maintenanceNotes: [
      'Verificar mensualmente el espacio disponible en el servidor',
      'La operación puede ser intensiva en I/O, programar durante horas de bajo tráfico',
      'Monitorear los tiempos de ejecución para ajustar la frecuencia si es necesario'
    ],
    businessImpact: 'Mantiene el rendimiento de las consultas principales al reducir el volumen de datos en las tablas transaccionales, sin perder acceso al historial completo de vuelos.',
    performanceConsiderations: [
      'El evento utiliza transacciones con lotes pequeños para minimizar bloqueos',
      'Se ejecuta durante la madrugada para minimizar impacto en operaciones',
      'Incluye índices optimizados para mejorar la velocidad de archivado'
    ],
    exampleResults: {
      description: 'Resultado de la última ejecución',
      result: "Archivados 986 vuelos y 4,930 tickets relacionados\nTiempo de ejecución: 01:45:22\nEspacio liberado: 28.3 MB"
    }
  },
  ev_update_flight_status: {
    name: 'ev_update_flight_status',
    description: 'Actualiza automáticamente el estado de los vuelos a "Departed" cuando ha pasado su hora programada de salida, manteniendo la información de vuelos actualizada.',
    schedule: {
      type: 'RECURRING',
      interval: {
        value: 5,
        unit: 'MINUTE'
      }
    },
    affectedTables: [
      {
        name: 'flights',
        operation: 'SELECT',
        description: 'Lee los vuelos con estado "Scheduled" cuya hora de salida ya ha pasado',
        estimatedRecords: '~10-20 por hora'
      },
      {
        name: 'flights',
        operation: 'UPDATE',
        description: 'Actualiza el estado a "Departed" para los vuelos identificados',
        estimatedRecords: '~10-20 por hora'
      },
      {
        name: 'flight_status_history',
        operation: 'INSERT',
        description: 'Registra el cambio de estado en el historial',
        estimatedRecords: '~10-20 por hora'
      }
    ],
    executionHistory: [
      {
        date: '2025-05-26 14:55:00',
        status: 'SUCCESS',
        recordsProcessed: 3,
        duration: '00:00:12'
      },
      {
        date: '2025-05-26 14:50:00',
        status: 'SUCCESS',
        recordsProcessed: 2,
        duration: '00:00:08'
      },
      {
        date: '2025-05-26 14:45:00',
        status: 'SUCCESS',
        recordsProcessed: 1,
        duration: '00:00:06'
      }
    ],
    preservationPolicy: {
      dataRetention: 'No requiere política de retención específica, los cambios se conservan en flight_status_history',
      archiving: false
    },
    maintenanceNotes: [
      'Verificar periódicamente que el intervalo de 5 minutos sea adecuado',
      'Confirmar que los vuelos no se marquen como "Departed" prematuramente',
      'Monitorear rendimiento y considerar ajustar en temporadas de alto tráfico'
    ],
    businessImpact: 'Proporciona información en tiempo real a los pasajeros y personal sobre el estado de los vuelos, mejorando la experiencia del cliente y la eficiencia operativa.',
    performanceConsiderations: [
      'Evento ligero que procesa pocos registros por ejecución',
      'Incluye condición de bloqueo optimista para evitar concurrencia con actualizaciones manuales',
      'Utiliza índices sobre departure_time y status para ejecución rápida'
    ],
    exampleResults: {
      description: 'Resultado de ejecución actual',
      result: "Vuelos actualizados: 3\nIDs: 5432, 5436, 5441\nTiempo de procesamiento: 0.12 segundos"
    }
  },
  ev_cleanup_expired_bookings: {
    name: 'ev_cleanup_expired_bookings',
    description: 'Elimina reservas pendientes que han expirado (más de 24 horas desde su creación) para mantener la base de datos limpia.',
    schedule: {
      type: 'RECURRING',
      interval: { value: 1, unit: 'HOUR' }
    },
    affectedTables: [
      { name: 'bookings', operation: 'DELETE', description: 'Elimina reservas con estado Pending y fecha de creación mayor a 24 horas' }
    ],
    executionHistory: [
      { date: '2025-05-27 01:00:00', status: 'SUCCESS', recordsProcessed: 12, duration: '00:00:03' },
      { date: '2025-05-26 01:00:00', status: 'SUCCESS', recordsProcessed: 8, duration: '00:00:02' }
    ],
    preservationPolicy: { dataRetention: 'No aplica, solo elimina registros expirados', archiving: false },
    maintenanceNotes: [
      'Revisar periódicamente el volumen de reservas eliminadas',
      'Ajustar la frecuencia si se detectan picos de reservas pendientes',
      'Verificar que no se eliminen reservas válidas por error de fecha'
    ],
    businessImpact: 'Evita acumulación de reservas no confirmadas, mejorando el rendimiento y la precisión de reportes.',
    performanceConsiderations: [
      'Operación rápida, afecta solo registros antiguos',
      'No requiere transacciones complejas',
      'Puede ejecutarse en horarios de baja demanda'
    ],
    exampleResults: { description: 'Reservas eliminadas en la última ejecución', result: '12 reservas pendientes eliminadas' }
  },
  ev_send_departure_reminders: {
    name: 'ev_send_departure_reminders',
    description: 'Envía recordatorios automáticos para vuelos próximos a salir (dentro de las próximas 3 horas).',
    schedule: {
      type: 'RECURRING',
      interval: { value: 1, unit: 'HOUR' }
    },
    affectedTables: [
      { name: 'flights', operation: 'SELECT', description: 'Selecciona vuelos con salida en las próximas 3 horas' },
      { name: 'audit_logs', operation: 'INSERT', description: 'Registra el envío de recordatorio para cada vuelo' }
    ],
    executionHistory: [
      { date: '2025-05-27 06:00:00', status: 'SUCCESS', recordsProcessed: 5, duration: '00:00:04' },
      { date: '2025-05-26 06:00:00', status: 'SUCCESS', recordsProcessed: 7, duration: '00:00:05' }
    ],
    preservationPolicy: { dataRetention: 'Los logs se conservan por 1 año', archiving: false },
    maintenanceNotes: [
      'Verificar que los recordatorios no se dupliquen',
      'Asegurar que los vuelos seleccionados sean los correctos',
      'Monitorear el volumen de logs generados'
    ],
    businessImpact: 'Mejora la puntualidad y satisfacción de los pasajeros al recordarles sus vuelos próximos.',
    performanceConsiderations: [
      'Consulta eficiente por índices en departure_time',
      'Inserción masiva en logs puede requerir monitoreo',
      'No afecta operaciones críticas'
    ],
    exampleResults: { description: 'Recordatorios enviados en la última ejecución', result: '5 vuelos notificados' }
  },
  ev_award_loyalty_monthly: {
    name: 'ev_award_loyalty_monthly',
    description: 'Actualiza mensualmente el nivel de los programas de lealtad según el balance de puntos de cada usuario.',
    schedule: {
      type: 'RECURRING',
      interval: { value: 1, unit: 'MONTH' },
      specificTime: '03:00:00'
    },
    affectedTables: [
      { name: 'loyalty_programs', operation: 'UPDATE', description: 'Actualiza el nivel de lealtad de cada usuario según sus puntos' }
    ],
    executionHistory: [
      { date: '2025-05-01 03:00:00', status: 'SUCCESS', recordsProcessed: 120, duration: '00:00:10' },
      { date: '2025-04-01 03:00:00', status: 'SUCCESS', recordsProcessed: 115, duration: '00:00:09' }
    ],
    preservationPolicy: { dataRetention: 'Los cambios se reflejan en la tabla, no requiere retención adicional', archiving: false },
    maintenanceNotes: [
      'Verificar que la función fn_loyalty_tier esté actualizada',
      'Revisar logs de cambios mensualmente',
      'Ajustar la hora de ejecución si impacta en reportes nocturnos'
    ],
    businessImpact: 'Fomenta la fidelidad de los clientes y automatiza la gestión de niveles de lealtad.',
    performanceConsiderations: [
      'Actualización masiva mensual, puede requerir optimización en tablas grandes',
      'Ejecutar fuera de horario pico',
      'Monitorear tiempos de ejecución en cada ciclo'
    ],
    exampleResults: { description: 'Usuarios actualizados en la última ejecución', result: '120 programas de lealtad actualizados' }
  }
};
