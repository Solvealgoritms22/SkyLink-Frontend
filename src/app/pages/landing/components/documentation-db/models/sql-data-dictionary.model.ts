/**
 * Modelo de datos para el diccionario de datos y relaciones de la base de datos
 * Este archivo define la estructura de los datos para generar un diccionario de datos
 * detallado y visualizar las relaciones entre tablas.
 */

// Interfaces para columnas de tablas
export interface TableColumn {
  name: string;
  type: string;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  referencedTable?: string;
  referencedColumn?: string;
}

// Interfaces para relaciones entre tablas
export interface TableRelation {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  table: string;
  description: string;
  columns: {local: string, foreign: string}[];
}

// Interfaces para índices de tablas
export interface TableIndex {
  name: string;
  columns: string[];
  type: string;
  description: string;
}

// Interfaces para consultas de ejemplo
export interface ExampleQuery {
  description: string;
  sql: string;
  result?: string;
}

// Diccionario de datos para airports
export const airportsDataDictionary = {
  columns: [
    {
      name: 'airport_id',
      type: 'INT',
      description: 'Identificador único del aeropuerto',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'iata_code',
      type: 'CHAR(3)',
      description: 'Código IATA de tres letras que identifica el aeropuerto',
      isUnique: true,
      isNullable: false
    },
    {
      name: 'name',
      type: 'VARCHAR(100)',
      description: 'Nombre completo del aeropuerto',
      isNullable: false
    },
    {
      name: 'city',
      type: 'VARCHAR(100)',
      description: 'Ciudad donde se encuentra el aeropuerto',
      isNullable: false
    },
    {
      name: 'country',
      type: 'VARCHAR(100)',
      description: 'País donde se encuentra el aeropuerto',
      isNullable: false
    },
    {
      name: 'latitude',
      type: 'DECIMAL(9,6)',
      description: 'Coordenada de latitud del aeropuerto',
      isNullable: true
    },
    {
      name: 'longitude',
      type: 'DECIMAL(9,6)',
      description: 'Coordenada de longitud del aeropuerto',
      isNullable: true
    },
    {
      name: 'timezone',
      type: 'VARCHAR(50)',
      description: 'Zona horaria del aeropuerto (ej. "America/New_York")',
      isNullable: true
    }
  ],
  relations: [
    {
      type: 'one-to-many',
      table: 'routes',
      description: 'Un aeropuerto puede ser origen de múltiples rutas',
      columns: [{local: 'airport_id', foreign: 'origin_id'}]
    },
    {
      type: 'one-to-many',
      table: 'routes',
      description: 'Un aeropuerto puede ser destino de múltiples rutas',
      columns: [{local: 'airport_id', foreign: 'destination_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['airport_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar aeropuertos únicos'
    },
    {
      name: 'idx_iata_code',
      columns: ['iata_code'],
      type: 'UNIQUE',
      description: 'Índice único para búsquedas rápidas por código IATA'
    },
    {
      name: 'idx_location',
      columns: ['city', 'country'],
      type: 'INDEX',
      description: 'Índice para búsquedas geográficas por ciudad y país'
    }
  ],
  exampleQueries: [
    {
      description: 'Consultar todos los aeropuertos de un país específico',
      sql: `SELECT airport_id, iata_code, name, city 
FROM airports 
WHERE country = 'República Dominicana' 
ORDER BY city;`,
      result: `+------------+-----------+------------------------------------------+----------------+
| airport_id | iata_code | name                                     | city           |
+------------+-----------+------------------------------------------+----------------+
|          1 | SDQ       | Aeropuerto Internacional Las Américas    | Santo Domingo  |
|          4 | POP       | Aeropuerto Internacional Gregorio Luperón| Puerto Plata   |
|          8 | STI       | Aeropuerto Internacional Cibao           | Santiago       |
|         12 | PUJ       | Aeropuerto Internacional de Punta Cana   | Punta Cana     |
+------------+-----------+------------------------------------------+----------------+`
    },
    {
      description: 'Encontrar aeropuertos dentro de un rango de coordenadas',
      sql: `SELECT name, city, latitude, longitude 
FROM airports 
WHERE latitude BETWEEN 18.0 AND 20.0 
  AND longitude BETWEEN -72.0 AND -68.0;`
    }
  ]
};

// Diccionario de datos para airlines
export const airlinesDataDictionary = {
  columns: [
    {
      name: 'airline_id',
      type: 'INT',
      description: 'Identificador único de la aerolínea',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'iata_code',
      type: 'CHAR(2)',
      description: 'Código IATA de dos letras que identifica la aerolínea',
      isUnique: true,
      isNullable: false
    },
    {
      name: 'name',
      type: 'VARCHAR(100)',
      description: 'Nombre completo de la aerolínea',
      isNullable: false
    },
    {
      name: 'call_sign',
      type: 'VARCHAR(50)',
      description: 'Señal de llamada utilizada en comunicaciones de radio',
      isNullable: true
    }
  ],
  relations: [
    {
      type: 'one-to-many',
      table: 'routes',
      description: 'Una aerolínea puede operar múltiples rutas',
      columns: [{local: 'airline_id', foreign: 'airline_id'}]
    },
    {
      type: 'one-to-many',
      table: 'aircraft',
      description: 'Una aerolínea puede tener múltiples aeronaves',
      columns: [{local: 'airline_id', foreign: 'airline_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['airline_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar aerolíneas únicas'
    },
    {
      name: 'idx_iata_code',
      columns: ['iata_code'],
      type: 'UNIQUE',
      description: 'Índice único para búsquedas rápidas por código IATA'
    }
  ],
  exampleQueries: [
    {
      description: 'Listar todas las aerolíneas con su código IATA',
      sql: `SELECT airline_id, iata_code, name 
FROM airlines 
ORDER BY name;`
    }
  ]
};

// Diccionario de datos para aircraft
export const aircraftDataDictionary = {
  columns: [
    {
      name: 'aircraft_id',
      type: 'INT',
      description: 'Identificador único de la aeronave',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'tail_number',
      type: 'VARCHAR(10)',
      description: 'Número de registro único de la aeronave (matrícula)',
      isUnique: true,
      isNullable: false
    },
    {
      name: 'airline_id',
      type: 'INT',
      description: 'ID de la aerolínea propietaria de la aeronave',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'airlines',
      referencedColumn: 'airline_id'
    },
    {
      name: 'model',
      type: 'VARCHAR(50)',
      description: 'Modelo de la aeronave (ej. "Boeing 737-800", "Airbus A320")',
      isNullable: false
    },
    {
      name: 'seat_capacity',
      type: 'INT',
      description: 'Cantidad total de asientos disponibles en la aeronave',
      isNullable: false
    },
    {
      name: 'manufacture_year',
      type: 'SMALLINT',
      description: 'Año de fabricación de la aeronave',
      isNullable: true
    }
  ],
  relations: [
    {
      type: 'many-to-one',
      table: 'airlines',
      description: 'Cada aeronave pertenece a una aerolínea',
      columns: [{local: 'airline_id', foreign: 'airline_id'}]
    },
    {
      type: 'one-to-many',
      table: 'flights',
      description: 'Una aeronave puede operar múltiples vuelos',
      columns: [{local: 'aircraft_id', foreign: 'aircraft_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['aircraft_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar aeronaves únicas'
    },
    {
      name: 'idx_tail_number',
      columns: ['tail_number'],
      type: 'UNIQUE',
      description: 'Índice único para búsquedas rápidas por número de matrícula'
    },
    {
      name: 'idx_airline_id',
      columns: ['airline_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por aerolínea'
    }
  ],
  exampleQueries: [
    {
      description: 'Consultar todas las aeronaves de una aerolínea específica',
      sql: `SELECT a.tail_number, a.model, a.seat_capacity, a.manufacture_year 
FROM aircraft a
JOIN airlines al ON a.airline_id = al.airline_id
WHERE al.name = 'SkyLink Airlines'
ORDER BY a.manufacture_year DESC;`
    },
    {
      description: 'Encontrar aeronaves con capacidad mayor a cierto número',
      sql: `SELECT a.tail_number, a.model, a.seat_capacity, al.name AS airline
FROM aircraft a
JOIN airlines al ON a.airline_id = al.airline_id
WHERE a.seat_capacity > 150
ORDER BY a.seat_capacity DESC;`
    }
  ]
};

// Diccionario de datos para routes
export const routesDataDictionary = {
  columns: [
    {
      name: 'route_id',
      type: 'INT',
      description: 'Identificador único de la ruta',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'airline_id',
      type: 'INT',
      description: 'ID de la aerolínea que opera la ruta',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'airlines',
      referencedColumn: 'airline_id'
    },
    {
      name: 'origin_id',
      type: 'INT',
      description: 'ID del aeropuerto de origen',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'airports',
      referencedColumn: 'airport_id'
    },
    {
      name: 'destination_id',
      type: 'INT',
      description: 'ID del aeropuerto de destino',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'airports',
      referencedColumn: 'airport_id'
    },
    {
      name: 'distance_km',
      type: 'INT',
      description: 'Distancia entre origen y destino en kilómetros',
      isNullable: true
    }
  ],
  relations: [
    {
      type: 'many-to-one',
      table: 'airlines',
      description: 'Cada ruta es operada por una aerolínea',
      columns: [{local: 'airline_id', foreign: 'airline_id'}]
    },
    {
      type: 'many-to-one',
      table: 'airports',
      description: 'Cada ruta tiene un aeropuerto de origen',
      columns: [{local: 'origin_id', foreign: 'airport_id'}]
    },
    {
      type: 'many-to-one',
      table: 'airports',
      description: 'Cada ruta tiene un aeropuerto de destino',
      columns: [{local: 'destination_id', foreign: 'airport_id'}]
    },
    {
      type: 'one-to-many',
      table: 'flights',
      description: 'Una ruta puede tener múltiples vuelos programados',
      columns: [{local: 'route_id', foreign: 'route_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['route_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar rutas únicas'
    },
    {
      name: 'idx_airline',
      columns: ['airline_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por aerolínea'
    },
    {
      name: 'idx_origin',
      columns: ['origin_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por aeropuerto de origen'
    },
    {
      name: 'idx_destination',
      columns: ['destination_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por aeropuerto de destino'
    },
    {
      name: 'idx_route_unique',
      columns: ['airline_id', 'origin_id', 'destination_id'],
      type: 'UNIQUE',
      description: 'Índice único para evitar rutas duplicadas de la misma aerolínea entre los mismos aeropuertos'
    }
  ],
  exampleQueries: [
    {
      description: 'Encontrar todas las rutas que salen de un aeropuerto específico',
      sql: `SELECT r.route_id, orig.iata_code AS origin, dest.iata_code AS destination, 
       a.name AS airline, r.distance_km
FROM routes r
JOIN airports orig ON r.origin_id = orig.airport_id
JOIN airports dest ON r.destination_id = dest.airport_id
JOIN airlines a ON r.airline_id = a.airline_id
WHERE orig.iata_code = 'SDQ'
ORDER BY a.name, dest.iata_code;`
    },
    {
      description: 'Calcular la distancia promedio de rutas por aerolínea',
      sql: `SELECT a.name AS airline, AVG(r.distance_km) AS avg_distance_km, 
       COUNT(r.route_id) AS route_count
FROM routes r
JOIN airlines a ON r.airline_id = a.airline_id
GROUP BY a.name
ORDER BY avg_distance_km DESC;`
    }
  ]
};

// Diccionario de datos para flights
export const flightsDataDictionary = {
  columns: [
    {
      name: 'flight_id',
      type: 'INT',
      description: 'Identificador único del vuelo',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'route_id',
      type: 'INT',
      description: 'ID de la ruta que sigue este vuelo',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'routes',
      referencedColumn: 'route_id'
    },
    {
      name: 'aircraft_id',
      type: 'INT',
      description: 'ID de la aeronave asignada al vuelo',
      isForeignKey: true,
      isNullable: false,
      referencedTable: 'aircraft',
      referencedColumn: 'aircraft_id'
    },
    {
      name: 'flight_number',
      type: 'VARCHAR(10)',
      description: 'Número de vuelo (código alfanumérico que identifica el vuelo)',
      isNullable: false
    },
    {
      name: 'departure_time',
      type: 'DATETIME',
      description: 'Fecha y hora programada de salida',
      isNullable: false
    },
    {
      name: 'arrival_time',
      type: 'DATETIME',
      description: 'Fecha y hora programada de llegada',
      isNullable: false
    },
    {
      name: 'status',
      type: "ENUM('Scheduled','Boarding','Departed','Arrived','Cancelled','Delayed','Maintenance')",
      description: 'Estado actual del vuelo',
      isNullable: false,
      defaultValue: "'Scheduled'"
    },
    {
      name: 'base_fare',
      type: 'DECIMAL(10,2)',
      description: 'Tarifa base para este vuelo (sin incluir impuestos/tasas)',
      isNullable: false
    }
  ],
  relations: [
    {
      type: 'many-to-one',
      table: 'routes',
      description: 'Cada vuelo sigue una ruta específica',
      columns: [{local: 'route_id', foreign: 'route_id'}]
    },
    {
      type: 'many-to-one',
      table: 'aircraft',
      description: 'Cada vuelo es operado por una aeronave específica',
      columns: [{local: 'aircraft_id', foreign: 'aircraft_id'}]
    },
    {
      type: 'one-to-many',
      table: 'bookings',
      description: 'Un vuelo puede tener múltiples reservas',
      columns: [{local: 'flight_id', foreign: 'flight_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['flight_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar vuelos únicos'
    },
    {
      name: 'idx_route',
      columns: ['route_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por ruta'
    },
    {
      name: 'idx_aircraft',
      columns: ['aircraft_id'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por aeronave'
    },
    {
      name: 'idx_departure',
      columns: ['departure_time'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por fecha/hora de salida'
    },
    {
      name: 'idx_status',
      columns: ['status'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por estado del vuelo'
    },
    {
      name: 'idx_flight_number',
      columns: ['flight_number'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por número de vuelo'
    }
  ],
  exampleQueries: [
    {
      description: 'Buscar vuelos disponibles entre dos ciudades para una fecha específica',
      sql: `SELECT f.flight_id, f.flight_number, a.name AS airline, 
       orig.city AS origin_city, dest.city AS destination_city,
       f.departure_time, f.arrival_time, f.base_fare
FROM flights f
JOIN routes r ON f.route_id = r.route_id
JOIN airlines a ON r.airline_id = a.airline_id
JOIN airports orig ON r.origin_id = orig.airport_id
JOIN airports dest ON r.destination_id = dest.airport_id
WHERE orig.city = 'Santo Domingo' 
  AND dest.city = 'Santiago'
  AND DATE(f.departure_time) = '2023-08-15'
  AND f.status NOT IN ('Cancelled', 'Maintenance')
ORDER BY f.departure_time;`
    },
    {
      description: 'Obtener estadísticas de vuelos por aerolínea del mes actual',
      sql: `SELECT a.name AS airline, 
       COUNT(*) AS total_flights,
       SUM(CASE WHEN f.status = 'Departed' OR f.status = 'Arrived' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN f.status = 'Delayed' THEN 1 ELSE 0 END) AS delayed,
       SUM(CASE WHEN f.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
       FORMAT(AVG(f.base_fare), 2) AS avg_fare
FROM flights f
JOIN routes r ON f.route_id = r.route_id
JOIN airlines a ON r.airline_id = a.airline_id
WHERE MONTH(f.departure_time) = MONTH(CURRENT_DATE())
  AND YEAR(f.departure_time) = YEAR(CURRENT_DATE())
GROUP BY a.name
ORDER BY total_flights DESC;`
    }
  ]
};

// Diccionario de datos para passengers
export const passengersDataDictionary = {
  columns: [
    {
      name: 'passenger_id',
      type: 'INT',
      description: 'Identificador único del pasajero',
      isPrimaryKey: true,
      isNullable: false
    },
    {
      name: 'first_name',
      type: 'VARCHAR(50)',
      description: 'Nombre del pasajero',
      isNullable: false
    },
    {
      name: 'last_name',
      type: 'VARCHAR(50)',
      description: 'Apellido del pasajero',
      isNullable: false
    },
    {
      name: 'email',
      type: 'VARCHAR(100)',
      description: 'Dirección de correo electrónico del pasajero',
      isNullable: true
    },
    {
      name: 'phone',
      type: 'VARCHAR(20)',
      description: 'Número de teléfono del pasajero',
      isNullable: true
    },
    {
      name: 'birth_date',
      type: 'DATE',
      description: 'Fecha de nacimiento del pasajero',
      isNullable: true
    },
    {
      name: 'nationality',
      type: 'VARCHAR(50)',
      description: 'Nacionalidad del pasajero',
      isNullable: true
    },
    {
      name: 'passport',
      type: 'VARCHAR(20)',
      description: 'Número de pasaporte del pasajero',
      isNullable: true
    },
    {
      name: 'frequent_flyer_number',
      type: 'VARCHAR(20)',
      description: 'Número de viajero frecuente',
      isNullable: true
    }
  ],
  relations: [
    {
      type: 'one-to-many',
      table: 'bookings',
      description: 'Un pasajero puede tener múltiples reservas',
      columns: [{local: 'passenger_id', foreign: 'passenger_id'}]
    }
  ],
  indexes: [
    {
      name: 'PRIMARY',
      columns: ['passenger_id'],
      type: 'PRIMARY KEY',
      description: 'Índice primario para identificar pasajeros únicos'
    },
    {
      name: 'idx_passenger_email',
      columns: ['email'],
      type: 'UNIQUE',
      description: 'Índice único para búsquedas rápidas por correo electrónico'
    },
    {
      name: 'idx_passenger_name',
      columns: ['last_name', 'first_name'],
      type: 'INDEX',
      description: 'Índice para búsquedas rápidas por nombre y apellido'
    }
  ],
  exampleQueries: [
    {
      description: 'Buscar pasajeros por apellido',
      sql: `SELECT passenger_id, first_name, last_name, email, phone
FROM passengers
WHERE last_name LIKE 'Rodríguez%'
ORDER BY first_name;`
    },
    {
      description: 'Encontrar pasajeros frecuentes (con más reservas)',
      sql: `SELECT p.passenger_id, p.first_name, p.last_name, p.email, COUNT(b.booking_id) AS total_bookings
FROM passengers p
JOIN bookings b ON p.passenger_id = b.passenger_id
GROUP BY p.passenger_id, p.first_name, p.last_name, p.email
HAVING COUNT(b.booking_id) > 5
ORDER BY total_bookings DESC;`
    }
  ]
};

// Diccionario de datos para bookings
export const bookingsDataDictionary = {
  columns: [
    { name: 'booking_id', type: 'INT', description: 'Identificador único de la reserva', isPrimaryKey: true, isNullable: false },
    { name: 'booking_code', type: 'CHAR(6)', description: 'Código único de la reserva', isUnique: true, isNullable: false },
    { name: 'booking_date', type: 'DATETIME', description: 'Fecha y hora de creación de la reserva', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    { name: 'status', type: "ENUM('Pending','Confirmed','Cancelled')", description: 'Estado de la reserva', isNullable: false, defaultValue: "'Pending'" },
    { name: 'total_amount', type: 'DECIMAL(10,2)', description: 'Monto total de la reserva', isNullable: true, defaultValue: '0' }
  ],
  relations: [
    { type: 'one-to-many', table: 'booking_passengers', description: 'Una reserva puede tener varios pasajeros asociados', columns: [{local: 'booking_id', foreign: 'booking_id'}] },
    { type: 'one-to-many', table: 'tickets', description: 'Una reserva puede generar varios tickets', columns: [{local: 'booking_id', foreign: 'booking_id'}] },
    { type: 'one-to-many', table: 'payments', description: 'Una reserva puede tener varios pagos asociados', columns: [{local: 'booking_id', foreign: 'booking_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['booking_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar reservas únicas' },
    { name: 'idx_booking_code', columns: ['booking_code'], type: 'UNIQUE', description: 'Índice único para búsquedas rápidas por código de reserva' }
  ],
  exampleQueries: [
    { description: 'Buscar reservas confirmadas en el último mes', sql: `SELECT booking_id, booking_code, booking_date, total_amount FROM bookings WHERE status = 'Confirmed' AND booking_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH);` }
  ]
};

// Diccionario de datos para booking_passengers
export const bookingPassengersDataDictionary = {
  columns: [
    { name: 'booking_id', type: 'INT', description: 'ID de la reserva', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'bookings', referencedColumn: 'booking_id' },
    { name: 'passenger_id', type: 'INT', description: 'ID del pasajero', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'passengers', referencedColumn: 'passenger_id' },
    { name: 'fare_class_id', type: 'INT', description: 'Clase de tarifa', isForeignKey: true, isNullable: false, referencedTable: 'fare_classes', referencedColumn: 'fare_class_id' },
    { name: 'loyalty_points_awarded', type: 'INT', description: 'Puntos de lealtad otorgados', isNullable: true, defaultValue: '0' }
  ],
  relations: [
    { type: 'many-to-one', table: 'bookings', description: 'Cada registro pertenece a una reserva', columns: [{local: 'booking_id', foreign: 'booking_id'}] },
    { type: 'many-to-one', table: 'passengers', description: 'Cada registro pertenece a un pasajero', columns: [{local: 'passenger_id', foreign: 'passenger_id'}] },
    { type: 'many-to-one', table: 'fare_classes', description: 'Clase de tarifa asociada', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['booking_id', 'passenger_id'], type: 'PRIMARY KEY', description: 'Índice primario compuesto' }
  ],
  exampleQueries: [
    { description: 'Listar pasajeros de una reserva', sql: `SELECT bp.passenger_id, p.first_name, p.last_name, bp.fare_class_id FROM booking_passengers bp JOIN passengers p ON bp.passenger_id = p.passenger_id WHERE bp.booking_id = 123;` }
  ]
};

// Diccionario de datos para tickets
export const ticketsDataDictionary = {
  columns: [
    { name: 'ticket_id', type: 'INT', description: 'Identificador único del ticket', isPrimaryKey: true, isNullable: false },
    { name: 'booking_id', type: 'INT', description: 'ID de la reserva', isForeignKey: true, isNullable: false, referencedTable: 'bookings', referencedColumn: 'booking_id' },
    { name: 'flight_id', type: 'INT', description: 'ID del vuelo', isForeignKey: true, isNullable: false, referencedTable: 'flights', referencedColumn: 'flight_id' },
    { name: 'passenger_id', type: 'INT', description: 'ID del pasajero', isForeignKey: true, isNullable: false, referencedTable: 'passengers', referencedColumn: 'passenger_id' },
    { name: 'seat_number', type: 'VARCHAR(5)', description: 'Número de asiento', isNullable: true },
    { name: 'fare_class_id', type: 'INT', description: 'Clase de tarifa', isForeignKey: true, isNullable: false, referencedTable: 'fare_classes', referencedColumn: 'fare_class_id' },
    { name: 'price_paid', type: 'DECIMAL(10,2)', description: 'Precio pagado por el ticket', isNullable: false },
    { name: 'ticket_status', type: "ENUM('Active','Refunded','Used','Cancelled')", description: 'Estado del ticket', isNullable: false, defaultValue: "'Active'" }
  ],
  relations: [
    { type: 'many-to-one', table: 'bookings', description: 'Cada ticket pertenece a una reserva', columns: [{local: 'booking_id', foreign: 'booking_id'}] },
    { type: 'many-to-one', table: 'flights', description: 'Cada ticket corresponde a un vuelo', columns: [{local: 'flight_id', foreign: 'flight_id'}] },
    { type: 'many-to-one', table: 'passengers', description: 'Cada ticket corresponde a un pasajero', columns: [{local: 'passenger_id', foreign: 'passenger_id'}] },
    { type: 'many-to-one', table: 'fare_classes', description: 'Clase de tarifa del ticket', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['ticket_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar tickets únicos' }
  ],
  exampleQueries: [
    { description: 'Consultar tickets activos de un pasajero', sql: `SELECT t.ticket_id, t.seat_number, t.price_paid, f.flight_number FROM tickets t JOIN flights f ON t.flight_id = f.flight_id WHERE t.passenger_id = 456 AND t.ticket_status = 'Active';` }
  ]
};

// Diccionario de datos para payments
export const paymentsDataDictionary = {
  columns: [
    { name: 'payment_id', type: 'INT', description: 'Identificador único del pago', isPrimaryKey: true, isNullable: false },
    { name: 'booking_id', type: 'INT', description: 'ID de la reserva pagada', isForeignKey: true, isNullable: false, referencedTable: 'bookings', referencedColumn: 'booking_id' },
    { name: 'payment_date', type: 'DATETIME', description: 'Fecha y hora del pago', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    { name: 'amount', type: 'DECIMAL(10,2)', description: 'Monto pagado', isNullable: false },
    { name: 'method', type: "ENUM('CreditCard','DebitCard','Cash','Transfer')", description: 'Método de pago', isNullable: false },
    { name: 'status', type: "ENUM('Pending','Completed','Failed','Refunded')", description: 'Estado del pago', isNullable: false, defaultValue: "'Pending'" }
  ],
  relations: [
    { type: 'many-to-one', table: 'bookings', description: 'Cada pago está asociado a una reserva', columns: [{local: 'booking_id', foreign: 'booking_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['payment_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar pagos únicos' }
  ],
  exampleQueries: [
    { description: 'Pagos completados en la última semana', sql: `SELECT payment_id, booking_id, amount, payment_date FROM payments WHERE status = 'Completed' AND payment_date >= DATE_SUB(NOW(), INTERVAL 7 DAY);` }
  ]
};

// Diccionario de datos para baggage
export const baggageDataDictionary = {
  columns: [
    { name: 'baggage_id', type: 'INT', description: 'Identificador único del equipaje', isPrimaryKey: true, isNullable: false },
    { name: 'ticket_id', type: 'INT', description: 'ID del ticket asociado', isForeignKey: true, isNullable: false, referencedTable: 'tickets', referencedColumn: 'ticket_id' },
    { name: 'weight_kg', type: 'DECIMAL(5,2)', description: 'Peso del equipaje en kilogramos', isNullable: true },
    { name: 'bag_tag', type: 'VARCHAR(20)', description: 'Etiqueta única del equipaje', isUnique: true, isNullable: true }
  ],
  relations: [
    { type: 'many-to-one', table: 'tickets', description: 'Cada equipaje está asociado a un ticket', columns: [{local: 'ticket_id', foreign: 'ticket_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['baggage_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar equipajes únicos' },
    { name: 'idx_bag_tag', columns: ['bag_tag'], type: 'UNIQUE', description: 'Índice único para etiquetas de equipaje' }
  ],
  exampleQueries: [
    { description: 'Equipaje de un ticket', sql: `SELECT baggage_id, weight_kg, bag_tag FROM baggage WHERE ticket_id = 789;` }
  ]
};

// Diccionario de datos para staff
export const staffDataDictionary = {
  columns: [
    { name: 'staff_id', type: 'INT', description: 'Identificador único del empleado', isPrimaryKey: true, isNullable: false },
    { name: 'first_name', type: 'VARCHAR(50)', description: 'Nombre del empleado', isNullable: false },
    { name: 'last_name', type: 'VARCHAR(50)', description: 'Apellido del empleado', isNullable: false },
    { name: 'role', type: "ENUM('Pilot','CoPilot','CabinCrew','GroundStaff','Engineer')", description: 'Rol del empleado', isNullable: false },
    { name: 'hire_date', type: 'DATE', description: 'Fecha de contratación', isNullable: true },
    { name: 'airline_id', type: 'INT', description: 'ID de la aerolínea', isForeignKey: true, isNullable: true, referencedTable: 'airlines', referencedColumn: 'airline_id' }
  ],
  relations: [
    { type: 'many-to-one', table: 'airlines', description: 'Empleado asociado a una aerolínea', columns: [{local: 'airline_id', foreign: 'airline_id'}] },
    { type: 'one-to-many', table: 'crew_assignments', description: 'Empleado puede estar asignado a varios vuelos', columns: [{local: 'staff_id', foreign: 'staff_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['staff_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar empleados únicos' }
  ],
  exampleQueries: [
    { description: 'Listar pilotos contratados en 2024', sql: `SELECT staff_id, first_name, last_name FROM staff WHERE role = 'Pilot' AND hire_date >= '2024-01-01';` }
  ]
};

// Diccionario de datos para crew_assignments
export const crewAssignmentsDataDictionary = {
  columns: [
    { name: 'flight_id', type: 'INT', description: 'ID del vuelo', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'flights', referencedColumn: 'flight_id' },
    { name: 'staff_id', type: 'INT', description: 'ID del empleado', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'staff', referencedColumn: 'staff_id' },
    { name: 'position', type: "ENUM('Captain','FirstOfficer','Purser','FlightAttendant','Engineer')", description: 'Posición asignada', isNullable: true }
  ],
  relations: [
    { type: 'many-to-one', table: 'flights', description: 'Asignación corresponde a un vuelo', columns: [{local: 'flight_id', foreign: 'flight_id'}] },
    { type: 'many-to-one', table: 'staff', description: 'Asignación corresponde a un empleado', columns: [{local: 'staff_id', foreign: 'staff_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['flight_id', 'staff_id'], type: 'PRIMARY KEY', description: 'Índice primario compuesto' }
  ],
  exampleQueries: [
    { description: 'Ver tripulación asignada a un vuelo', sql: `SELECT ca.staff_id, s.first_name, s.last_name, ca.position FROM crew_assignments ca JOIN staff s ON ca.staff_id = s.staff_id WHERE ca.flight_id = 321;` }
  ]
};

// Diccionario de datos para checkins
export const checkinsDataDictionary = {
  columns: [
    { name: 'checkin_id', type: 'INT', description: 'Identificador único del check-in', isPrimaryKey: true, isNullable: false },
    { name: 'ticket_id', type: 'INT', description: 'ID del ticket', isForeignKey: true, isNullable: false, referencedTable: 'tickets', referencedColumn: 'ticket_id' },
    { name: 'checkin_time', type: 'DATETIME', description: 'Fecha y hora del check-in', isNullable: true, defaultValue: 'CURRENT_TIMESTAMP' },
    { name: 'baggage_count', type: 'INT', description: 'Cantidad de equipaje registrado', isNullable: true, defaultValue: '0' }
  ],
  relations: [
    { type: 'many-to-one', table: 'tickets', description: 'Check-in asociado a un ticket', columns: [{local: 'ticket_id', foreign: 'ticket_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['checkin_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar check-ins únicos' }
  ],
  exampleQueries: [
    { description: 'Check-ins realizados hoy', sql: `SELECT checkin_id, ticket_id, checkin_time FROM checkins WHERE DATE(checkin_time) = CURDATE();` }
  ]
};

// Diccionario de datos para boarding_passes
export const boardingPassesDataDictionary = {
  columns: [
    { name: 'bp_id', type: 'INT', description: 'Identificador único del pase de abordar', isPrimaryKey: true, isNullable: false },
    { name: 'checkin_id', type: 'INT', description: 'ID del check-in', isForeignKey: true, isNullable: false, referencedTable: 'checkins', referencedColumn: 'checkin_id' },
    { name: 'gate', type: 'VARCHAR(10)', description: 'Puerta de embarque', isNullable: true },
    { name: 'boarding_time', type: 'DATETIME', description: 'Hora de embarque', isNullable: true },
    { name: 'seat_number', type: 'VARCHAR(5)', description: 'Número de asiento', isNullable: true }
  ],
  relations: [
    { type: 'many-to-one', table: 'checkins', description: 'Pase de abordar asociado a un check-in', columns: [{local: 'checkin_id', foreign: 'checkin_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['bp_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar pases de abordar únicos' }
  ],
  exampleQueries: [
    { description: 'Pases de abordar para un check-in', sql: `SELECT bp_id, gate, boarding_time, seat_number FROM boarding_passes WHERE checkin_id = 555;` }
  ]
};

// Diccionario de datos para maintenance_logs
export const maintenanceLogsDataDictionary = {
  columns: [
    { name: 'log_id', type: 'INT', description: 'Identificador único del registro de mantenimiento', isPrimaryKey: true, isNullable: false },
    { name: 'aircraft_id', type: 'INT', description: 'ID de la aeronave', isForeignKey: true, isNullable: false, referencedTable: 'aircraft', referencedColumn: 'aircraft_id' },
    { name: 'maintenance_date', type: 'DATE', description: 'Fecha del mantenimiento', isNullable: false },
    { name: 'description', type: 'TEXT', description: 'Descripción del mantenimiento', isNullable: true },
    { name: 'status', type: "ENUM('Scheduled','InProgress','Completed')", description: 'Estado del mantenimiento', isNullable: false, defaultValue: "'Scheduled'" }
  ],
  relations: [
    { type: 'many-to-one', table: 'aircraft', description: 'Registro asociado a una aeronave', columns: [{local: 'aircraft_id', foreign: 'aircraft_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['log_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar registros únicos' }
  ],
  exampleQueries: [
    { description: 'Mantenimientos completados este mes', sql: `SELECT log_id, aircraft_id, maintenance_date, status FROM maintenance_logs WHERE status = 'Completed' AND MONTH(maintenance_date) = MONTH(CURDATE());` }
  ]
};

// Diccionario de datos para flight_status_history
export const flightStatusHistoryDataDictionary = {
  columns: [
    { name: 'status_id', type: 'INT', description: 'Identificador único del cambio de estado', isPrimaryKey: true, isNullable: false },
    { name: 'flight_id', type: 'INT', description: 'ID del vuelo', isForeignKey: true, isNullable: false, referencedTable: 'flights', referencedColumn: 'flight_id' },
    { name: 'status', type: "ENUM('Scheduled','Boarding','Departed','Arrived','Cancelled','Delayed','Maintenance')", description: 'Nuevo estado del vuelo', isNullable: false },
    { name: 'changed_at', type: 'DATETIME', description: 'Fecha y hora del cambio', isNullable: true, defaultValue: 'CURRENT_TIMESTAMP' }
  ],
  relations: [
    { type: 'many-to-one', table: 'flights', description: 'Cambio de estado asociado a un vuelo', columns: [{local: 'flight_id', foreign: 'flight_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['status_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar cambios únicos' }
  ],
  exampleQueries: [
    { description: 'Historial de estado de un vuelo', sql: `SELECT status_id, status, changed_at FROM flight_status_history WHERE flight_id = 1234 ORDER BY changed_at DESC;` }
  ]
};

// Diccionario de datos para audit_logs
export const auditLogsDataDictionary = {
  columns: [
    { name: 'audit_id', type: 'INT', description: 'Identificador único del log', isPrimaryKey: true, isNullable: false },
    { name: 'table_name', type: 'VARCHAR(50)', description: 'Nombre de la tabla afectada', isNullable: false },
    { name: 'operation', type: "ENUM('INSERT','UPDATE','DELETE')", description: 'Tipo de operación', isNullable: false },
    { name: 'record_id', type: 'INT', description: 'ID del registro afectado', isNullable: true },
    { name: 'changed_at', type: 'DATETIME', description: 'Fecha y hora del cambio', isNullable: true, defaultValue: 'CURRENT_TIMESTAMP' },
    { name: 'changed_by', type: 'VARCHAR(50)', description: 'Usuario o sistema que realizó el cambio', isNullable: true }
  ],
  relations: [],
  indexes: [
    { name: 'PRIMARY', columns: ['audit_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar logs únicos' }
  ],
  exampleQueries: [
    { description: 'Últimos cambios en la tabla bookings', sql: `SELECT audit_id, operation, record_id, changed_at, changed_by FROM audit_logs WHERE table_name = 'bookings' ORDER BY changed_at DESC LIMIT 10;` }
  ]
};

// Diccionario de datos para reservations_history
export const reservationsHistoryDataDictionary = {
  columns: [
    { name: 'hist_id', type: 'INT', description: 'Identificador único del historial', isPrimaryKey: true, isNullable: false },
    { name: 'booking_id', type: 'INT', description: 'ID de la reserva', isNullable: true },
    { name: 'status', type: "ENUM('Pending','Confirmed','Cancelled')", description: 'Estado de la reserva', isNullable: true },
    { name: 'changed_at', type: 'DATETIME', description: 'Fecha y hora del cambio', isNullable: true, defaultValue: 'CURRENT_TIMESTAMP' }
  ],
  relations: [],
  indexes: [
    { name: 'PRIMARY', columns: ['hist_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar historiales únicos' }
  ],
  exampleQueries: [
    { description: 'Historial de una reserva', sql: `SELECT hist_id, status, changed_at FROM reservations_history WHERE booking_id = 123;` }
  ]
};

// Diccionario de datos para seat_inventory
export const seatInventoryDataDictionary = {
  columns: [
    { name: 'flight_id', type: 'INT', description: 'ID del vuelo', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'flights', referencedColumn: 'flight_id' },
    { name: 'fare_class_id', type: 'INT', description: 'Clase de tarifa', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'fare_classes', referencedColumn: 'fare_class_id' },
    { name: 'seats_total', type: 'INT', description: 'Total de asientos disponibles', isNullable: false },
    { name: 'seats_sold', type: 'INT', description: 'Asientos vendidos', isNullable: false, defaultValue: '0' }
  ],
  relations: [
    { type: 'many-to-one', table: 'flights', description: 'Inventario asociado a un vuelo', columns: [{local: 'flight_id', foreign: 'flight_id'}] },
    { type: 'many-to-one', table: 'fare_classes', description: 'Inventario asociado a una clase de tarifa', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['flight_id', 'fare_class_id'], type: 'PRIMARY KEY', description: 'Índice primario compuesto' }
  ],
  exampleQueries: [
    { description: 'Disponibilidad de asientos por vuelo y clase', sql: `SELECT flight_id, fare_class_id, seats_total, seats_sold FROM seat_inventory WHERE flight_id = 4321;` }
  ]
};

// Diccionario de datos para fare_classes
export const fareClassesDataDictionary = {
  columns: [
    { name: 'fare_class_id', type: 'INT', description: 'Identificador único de la clase de tarifa', isPrimaryKey: true, isNullable: false },
    { name: 'code', type: 'CHAR(1)', description: 'Código de la clase de tarifa (E: Economy, B: Business, F: First)', isUnique: true, isNullable: false },
    { name: 'description', type: 'VARCHAR(50)', description: 'Descripción de la clase de tarifa', isNullable: true },
    { name: 'multiplier', type: 'DECIMAL(3,2)', description: 'Multiplicador de precio para la clase', isNullable: false }
  ],
  relations: [
    { type: 'one-to-many', table: 'flight_fares', description: 'Una clase de tarifa puede estar asociada a múltiples tarifas de vuelo', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] },
    { type: 'one-to-many', table: 'booking_passengers', description: 'Una clase de tarifa puede estar asociada a múltiples pasajeros en reservas', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] },
    { type: 'one-to-many', table: 'tickets', description: 'Una clase de tarifa puede estar asociada a múltiples tickets', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] },
    { type: 'one-to-many', table: 'seat_inventory', description: 'Una clase de tarifa puede estar asociada a múltiples inventarios de asientos', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['fare_class_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar clases de tarifa únicas' },
    { name: 'idx_code', columns: ['code'], type: 'UNIQUE', description: 'Índice único para códigos de clase de tarifa' }
  ],
  exampleQueries: [
    { description: 'Listar todas las clases de tarifa', sql: `SELECT fare_class_id, code, description, multiplier FROM fare_classes;` }
  ]
};

// Diccionario de datos para flight_fares
export const flightFaresDataDictionary = {
  columns: [
    { name: 'flight_id', type: 'INT', description: 'ID del vuelo', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'flights', referencedColumn: 'flight_id' },
    { name: 'fare_class_id', type: 'INT', description: 'ID de la clase de tarifa', isPrimaryKey: true, isForeignKey: true, isNullable: false, referencedTable: 'fare_classes', referencedColumn: 'fare_class_id' },
    { name: 'price', type: 'DECIMAL(10,2)', description: 'Precio de la tarifa para el vuelo y clase', isNullable: false },
    { name: 'seats_available', type: 'INT', description: 'Cantidad de asientos disponibles para esta clase en el vuelo', isNullable: false }
  ],
  relations: [
    { type: 'many-to-one', table: 'flights', description: 'Tarifa asociada a un vuelo', columns: [{local: 'flight_id', foreign: 'flight_id'}] },
    { type: 'many-to-one', table: 'fare_classes', description: 'Tarifa asociada a una clase de tarifa', columns: [{local: 'fare_class_id', foreign: 'fare_class_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['flight_id', 'fare_class_id'], type: 'PRIMARY KEY', description: 'Índice primario compuesto' }
  ],
  exampleQueries: [
    { description: 'Consultar tarifas de un vuelo', sql: `SELECT flight_id, fare_class_id, price, seats_available FROM flight_fares WHERE flight_id = 101;` }
  ]
};

// Diccionario de datos para loyalty_programs
export const loyaltyProgramsDataDictionary = {
  columns: [
    { name: 'loyalty_id', type: 'INT', description: 'Identificador único del programa de lealtad', isPrimaryKey: true, isNullable: false },
    { name: 'passenger_id', type: 'INT', description: 'ID del pasajero asociado', isForeignKey: true, isNullable: false, referencedTable: 'passengers', referencedColumn: 'passenger_id' },
    { name: 'tier', type: "ENUM('Bronze','Silver','Gold','Platinum')", description: 'Nivel de lealtad', isNullable: false, defaultValue: "'Bronze'" },
    { name: 'points_balance', type: 'INT', description: 'Balance de puntos acumulados', isNullable: false, defaultValue: '0' }
  ],
  relations: [
    { type: 'many-to-one', table: 'passengers', description: 'Programa de lealtad asociado a un pasajero', columns: [{local: 'passenger_id', foreign: 'passenger_id'}] }
  ],
  indexes: [
    { name: 'PRIMARY', columns: ['loyalty_id'], type: 'PRIMARY KEY', description: 'Índice primario para identificar programas de lealtad únicos' },
    { name: 'idx_passenger', columns: ['passenger_id'], type: 'UNIQUE', description: 'Índice único para asegurar un programa de lealtad por pasajero' }
  ],
  exampleQueries: [
    { description: 'Consultar programa de lealtad de un pasajero', sql: `SELECT loyalty_id, tier, points_balance FROM loyalty_programs WHERE passenger_id = 1234;` }
  ]
};

// Consolidar todos los diccionarios de datos
export const dataDictionary = {
  airports: airportsDataDictionary,
  airlines: airlinesDataDictionary,
  aircraft: aircraftDataDictionary,
  routes: routesDataDictionary,
  flights: flightsDataDictionary,
  passengers: passengersDataDictionary,
  bookings: bookingsDataDictionary,
  booking_passengers: bookingPassengersDataDictionary,
  tickets: ticketsDataDictionary,
  payments: paymentsDataDictionary,
  baggage: baggageDataDictionary,
  staff: staffDataDictionary,
  crew_assignments: crewAssignmentsDataDictionary,
  checkins: checkinsDataDictionary,
  boarding_passes: boardingPassesDataDictionary,
  maintenance_logs: maintenanceLogsDataDictionary,
  flight_status_history: flightStatusHistoryDataDictionary,
  audit_logs: auditLogsDataDictionary,
  reservations_history: reservationsHistoryDataDictionary,
  seat_inventory: seatInventoryDataDictionary,
  fare_classes: fareClassesDataDictionary,
  flight_fares: flightFaresDataDictionary,
  loyalty_programs: loyaltyProgramsDataDictionary
};

