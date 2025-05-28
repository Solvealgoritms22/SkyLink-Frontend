/**
 * Modelo de datos detallados para vistas SQL
 */

export interface ViewColumn {
  name: string;
  type: string;
  description: string;
  sourceTable?: string;
  sourceColumn?: string;
}

export interface ViewSourceTable {
  name: string;
  joinType?: 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL JOIN';
  joinCondition?: string;
  description: string;
}

export interface ViewDetail {
  name: string;
  description: string;
  columns: ViewColumn[];
  sourceTables: ViewSourceTable[];
  whereConditions?: string;
  orderBy?: string;
  useCases: string[];
  performanceNotes?: string;
  exampleQueries: {
    description: string;
    sql: string;
    result?: string;
  }[];
}

export const viewDetails: { [key: string]: ViewDetail } = {
  vw_upcoming_flights: {
    name: 'vw_upcoming_flights',
    description: 'Muestra los vuelos futuros con información detallada de origen, destino y estado',
    columns: [
      {
        name: 'flight_id',
        type: 'INT',
        description: 'ID del vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_id'
      },
      {
        name: 'flight_number',
        type: 'VARCHAR(10)',
        description: 'Número de vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_number'
      },
      {
        name: 'airline_name',
        type: 'VARCHAR(100)',
        description: 'Nombre de la aerolínea',
        sourceTable: 'airlines',
        sourceColumn: 'name'
      },
      {
        name: 'origin_code',
        type: 'CHAR(3)',
        description: 'Código IATA del aeropuerto de origen',
        sourceTable: 'airports (origin)',
        sourceColumn: 'iata_code'
      },
      {
        name: 'origin_name',
        type: 'VARCHAR(100)',
        description: 'Nombre del aeropuerto de origen',
        sourceTable: 'airports (origin)',
        sourceColumn: 'name'
      },
      {
        name: 'origin_city',
        type: 'VARCHAR(100)',
        description: 'Ciudad de origen',
        sourceTable: 'airports (origin)',
        sourceColumn: 'city'
      },
      {
        name: 'destination_code',
        type: 'CHAR(3)',
        description: 'Código IATA del aeropuerto de destino',
        sourceTable: 'airports (destination)',
        sourceColumn: 'iata_code'
      },
      {
        name: 'destination_name',
        type: 'VARCHAR(100)',
        description: 'Nombre del aeropuerto de destino',
        sourceTable: 'airports (destination)',
        sourceColumn: 'name'
      },
      {
        name: 'destination_city',
        type: 'VARCHAR(100)',
        description: 'Ciudad de destino',
        sourceTable: 'airports (destination)',
        sourceColumn: 'city'
      },
      {
        name: 'departure_time',
        type: 'DATETIME',
        description: 'Fecha y hora de salida',
        sourceTable: 'flights',
        sourceColumn: 'departure_time'
      },
      {
        name: 'arrival_time',
        type: 'DATETIME',
        description: 'Fecha y hora de llegada',
        sourceTable: 'flights',
        sourceColumn: 'arrival_time'
      },
      {
        name: 'status',
        type: 'ENUM',
        description: 'Estado actual del vuelo',
        sourceTable: 'flights',
        sourceColumn: 'status'
      },
      {
        name: 'duration_minutes',
        type: 'INT',
        description: 'Duración del vuelo en minutos (calculada)',
        sourceTable: 'Function',
        sourceColumn: 'fn_flight_duration(departure_time, arrival_time)'
      }
    ],
    sourceTables: [
      {
        name: 'flights',
        description: 'Tabla principal con información de vuelos'
      },
      {
        name: 'routes',
        joinType: 'INNER JOIN',
        joinCondition: 'flights.route_id = routes.route_id',
        description: 'Contiene información sobre las rutas de vuelo'
      },
      {
        name: 'airports (origin)',
        joinType: 'INNER JOIN',
        joinCondition: 'routes.origin_id = origin.airport_id',
        description: 'Información del aeropuerto de origen'
      },
      {
        name: 'airports (destination)',
        joinType: 'INNER JOIN',
        joinCondition: 'routes.destination_id = destination.airport_id',
        description: 'Información del aeropuerto de destino'
      },
      {
        name: 'airlines',
        joinType: 'INNER JOIN',
        joinCondition: 'routes.airline_id = airlines.airline_id',
        description: 'Información de la aerolínea'
      }
    ],
    whereConditions: 'flights.departure_time > NOW()',
    orderBy: 'flights.departure_time ASC',
    useCases: [
      'Mostrar listados de próximos vuelos en el sitio web',
      'Proporcionar información para pantallas de información en aeropuertos',
      'Filtrar vuelos disponibles para el sistema de reservas'
    ],
    performanceNotes: 'Esta vista utiliza múltiples JOINs y una condición de filtro por fecha. Se recomienda tener índices en flights.departure_time y todas las columnas utilizadas en las condiciones JOIN.',
    exampleQueries: [
      {
        description: 'Mostrar próximos vuelos para un día específico',
        sql: "SELECT flight_number, airline_name, origin_code, destination_code, departure_time, status\nFROM vw_upcoming_flights\nWHERE DATE(departure_time) = '2023-08-01'\nORDER BY departure_time;",
        result: "+---------------+------------------+-------------+------------------+---------------------+------------+\n| flight_number | airline_name     | origin_code | destination_code | departure_time      | status     |\n+---------------+------------------+-------------+------------------+---------------------+------------+\n| SL5501        | SkyLink Airlines | SDQ         | STI              | 2023-08-01 07:00:00 | Scheduled  |\n| SL2340        | SkyLink Airlines | PUJ         | SDQ              | 2023-08-01 09:30:00 | Scheduled  |\n| SL1870        | SkyLink Airlines | SDQ         | POP              | 2023-08-01 12:15:00 | Scheduled  |\n| SL3458        | SkyLink Airlines | STI         | SDQ              | 2023-08-01 16:45:00 | Scheduled  |\n+---------------+------------------+-------------+------------------+---------------------+------------+"
      },
      {
        description: 'Buscar vuelos entre dos ciudades',
        sql: "SELECT flight_number, departure_time, arrival_time, duration_minutes, status\nFROM vw_upcoming_flights\nWHERE origin_city = 'Santo Domingo' AND destination_city = 'Santiago'\n  AND departure_time > NOW()\nORDER BY departure_time\nLIMIT 3;"
      }
    ]
  },
  vw_flight_manifest: {
    name: 'vw_flight_manifest',
    description: 'Lista detallada de pasajeros en un vuelo con sus asientos asignados e información de contacto',
    columns: [
      {
        name: 'flight_id',
        type: 'INT',
        description: 'ID del vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_id'
      },
      {
        name: 'flight_number',
        type: 'VARCHAR(10)',
        description: 'Número de vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_number'
      },
      {
        name: 'departure_time',
        type: 'DATETIME',
        description: 'Fecha y hora de salida',
        sourceTable: 'flights',
        sourceColumn: 'departure_time'
      },
      {
        name: 'passenger_id',
        type: 'INT',
        description: 'ID del pasajero',
        sourceTable: 'passengers',
        sourceColumn: 'passenger_id'
      },
      {
        name: 'full_name',
        type: 'VARCHAR(101)',
        description: 'Nombre completo del pasajero (concatenado)',
        sourceTable: 'CONCAT',
        sourceColumn: 'CONCAT(p.first_name, " ", p.last_name)'
      },
      {
        name: 'email',
        type: 'VARCHAR(100)',
        description: 'Correo electrónico del pasajero',
        sourceTable: 'passengers',
        sourceColumn: 'email'
      },
      {
        name: 'phone',
        type: 'VARCHAR(20)',
        description: 'Teléfono del pasajero',
        sourceTable: 'passengers',
        sourceColumn: 'phone'
      },
      {
        name: 'seat_number',
        type: 'VARCHAR(4)',
        description: 'Número de asiento asignado',
        sourceTable: 'tickets',
        sourceColumn: 'seat_number'
      },
      {
        name: 'fare_class',
        type: 'VARCHAR(50)',
        description: 'Clase de tarifa',
        sourceTable: 'fare_classes',
        sourceColumn: 'name'
      },
      {
        name: 'checked_in',
        type: 'BOOLEAN',
        description: 'Estado de check-in',
        sourceTable: 'tickets',
        sourceColumn: 'checked_in'
      },
      {
        name: 'baggage_count',
        type: 'INT',
        description: 'Cantidad de equipaje registrado',
        sourceTable: 'COUNT',
        sourceColumn: 'COUNT(b.baggage_id)'
      }
    ],
    sourceTables: [
      {
        name: 'tickets',
        description: 'Contiene información de boletos'
      },
      {
        name: 'flights',
        joinType: 'INNER JOIN',
        joinCondition: 'tickets.flight_id = flights.flight_id',
        description: 'Información del vuelo'
      },
      {
        name: 'booking_passengers',
        joinType: 'INNER JOIN',
        joinCondition: 'tickets.booking_passenger_id = booking_passengers.booking_passenger_id',
        description: 'Relación entre reservas y pasajeros'
      },
      {
        name: 'passengers',
        joinType: 'INNER JOIN',
        joinCondition: 'booking_passengers.passenger_id = passengers.passenger_id',
        description: 'Información del pasajero'
      },
      {
        name: 'fare_classes',
        joinType: 'INNER JOIN',
        joinCondition: 'booking_passengers.fare_class_id = fare_classes.fare_class_id',
        description: 'Información de la clase de tarifa'
      },
      {
        name: 'baggage',
        joinType: 'LEFT JOIN',
        joinCondition: 'tickets.ticket_id = baggage.ticket_id',
        description: 'Información de equipaje'
      }
    ],
    orderBy: 'flights.flight_id, tickets.seat_number',
    useCases: [
      'Generación de manifiestos de vuelo para tripulación',
      'Control de embarque en las puertas',
      'Verificación de pasajeros durante el check-in'
    ],
    performanceNotes: 'Esta vista realiza múltiples JOINs y una operación de agrupación para contar el equipaje. Se recomienda materializar temporalmente los resultados cuando se requieren consultas frecuentes para el mismo vuelo.',
    exampleQueries: [
      {
        description: 'Obtener listado de pasajeros para un vuelo específico',
        sql: "SELECT full_name, seat_number, fare_class, checked_in, baggage_count\nFROM vw_flight_manifest\nWHERE flight_id = 123\nORDER BY seat_number;"
      },
      {
        description: 'Contar pasajeros por clase de tarifa',
        sql: "SELECT flight_number, departure_time, fare_class, COUNT(*) as passenger_count\nFROM vw_flight_manifest\nWHERE flight_id = 123\nGROUP BY flight_number, departure_time, fare_class\nORDER BY fare_class;"
      }
    ]
  },
  vw_flight_revenue: {
    name: 'vw_flight_revenue',
    description: 'Calcula los ingresos totales por vuelo, incluyendo tarifas base, impuestos y servicios adicionales',
    columns: [
      {
        name: 'flight_id',
        type: 'INT',
        description: 'ID del vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_id'
      },
      {
        name: 'flight_number',
        type: 'VARCHAR(10)',
        description: 'Número de vuelo',
        sourceTable: 'flights',
        sourceColumn: 'flight_number'
      },
      {
        name: 'departure_time',
        type: 'DATETIME',
        description: 'Fecha y hora de salida',
        sourceTable: 'flights',
        sourceColumn: 'departure_time'
      },
      {
        name: 'route_description',
        type: 'VARCHAR(209)',
        description: 'Descripción de ruta (origen-destino)',
        sourceTable: 'CONCAT',
        sourceColumn: 'CONCAT(ao.city, " (", ao.iata_code, ") - ", ad.city, " (", ad.iata_code, ")")'
      },
      {
        name: 'total_passengers',
        type: 'BIGINT',
        description: 'Total de pasajeros',
        sourceTable: 'COUNT',
        sourceColumn: 'COUNT(t.ticket_id)'
      },
      {
        name: 'base_revenue',
        type: 'DECIMAL(12,2)',
        description: 'Ingresos base sin impuestos',
        sourceTable: 'SUM',
        sourceColumn: 'SUM(t.base_price)'
      },
      {
        name: 'tax_revenue',
        type: 'DECIMAL(12,2)',
        description: 'Ingresos por impuestos',
        sourceTable: 'SUM',
        sourceColumn: 'SUM(t.tax_amount)'
      },
      {
        name: 'additional_revenue',
        type: 'DECIMAL(12,2)',
        description: 'Ingresos por servicios adicionales',
        sourceTable: 'SUM',
        sourceColumn: 'COALESCE(SUM(as.amount), 0)'
      },
      {
        name: 'total_revenue',
        type: 'DECIMAL(12,2)',
        description: 'Ingreso total',
        sourceTable: 'SUM',
        sourceColumn: 'SUM(t.base_price + t.tax_amount) + COALESCE(SUM(as.amount), 0)'
      },
      {
        name: 'occupancy_rate',
        type: 'DECIMAL(5,2)',
        description: 'Porcentaje de ocupación',
        sourceTable: 'Function',
        sourceColumn: 'fn_flight_occupancy(f.flight_id)'
      }
    ],
    sourceTables: [
      {
        name: 'flights',
        description: 'Información básica del vuelo'
      },
      {
        name: 'tickets',
        joinType: 'LEFT JOIN',
        joinCondition: 'flights.flight_id = tickets.flight_id',
        description: 'Boletos vendidos para el vuelo'
      },
      {
        name: 'routes',
        joinType: 'INNER JOIN',
        joinCondition: 'flights.route_id = routes.route_id',
        description: 'Información de la ruta'
      },
      {
        name: 'airports (origin)',
        joinType: 'INNER JOIN',
        joinCondition: 'routes.origin_id = ao.airport_id',
        description: 'Aeropuerto de origen'
      },
      {
        name: 'airports (destination)',
        joinType: 'INNER JOIN',
        joinCondition: 'routes.destination_id = ad.airport_id',
        description: 'Aeropuerto de destino'
      },
      {
        name: 'additional_services',
        joinType: 'LEFT JOIN',
        joinCondition: 'tickets.ticket_id = as.ticket_id',
        description: 'Servicios adicionales contratados'
      }
    ],
    whereConditions: 'flights.status IN (\'Departed\', \'Arrived\')',
    orderBy: 'flights.departure_time DESC',
    useCases: [
      'Reportes financieros por vuelo, ruta o período',
      'Análisis de rentabilidad de rutas',
      'Comparación de ingresos por temporada'
    ],
    performanceNotes: 'Esta vista realiza operaciones de agregación y cálculos sobre múltiples tablas. Puede ser intensiva en recursos para grandes conjuntos de datos históricos.',
    exampleQueries: [
      {
        description: 'Analizar ingresos del mes actual por ruta',
        sql: "SELECT route_description, COUNT(*) AS flights,\n       SUM(total_passengers) AS passengers,\n       SUM(total_revenue) AS revenue,\n       AVG(occupancy_rate) AS avg_occupancy\nFROM vw_flight_revenue\nWHERE MONTH(departure_time) = MONTH(CURRENT_DATE())\n  AND YEAR(departure_time) = YEAR(CURRENT_DATE())\nGROUP BY route_description\nORDER BY revenue DESC;"
      }
    ]
  }
};
