/**
 * Modelo de datos para la documentación general de la base de datos
 */

// Información de estadísticas de la base de datos
export const databaseStats = [
  {
    label: 'Tablas',
    value: 23,
    icon: 'pi-table'
  },
  {
    label: 'Relaciones',
    value: 19,
    icon: 'pi-link'
  },
  {
    label: 'Funciones',
    value: 10,
    icon: 'pi-code'
  },
  {
    label: 'Procedimientos',
    value: 10,
    icon: 'pi-cog'
  },
  {
    label: 'Disparadores',
    value: 10,
    icon: 'pi-bolt'
  },
  {
    label: 'Vistas',
    value: 10,
    icon: 'pi-eye'
  },
  {
    label: 'Eventos',
    value: 5,
    icon: 'pi-calendar'
  }
];

// Información del motor de base de datos
export const databaseEngine = {
  name: 'MySQL',
  version: '8.0.33',
  features: [
    'Transacciones ACID',
    'Procedimientos almacenados',
    'Disparadores',
    'Vistas',
    'Eventos',
    'Particionamiento',
    'JSON nativo',
    'Replicación',
    'Integridad referencial'
  ]
};

// URL del diagrama ER (actualizarlo con una URL real si está disponible)
export const erDiagramUrl = '';

// Descripción del diagrama ER
export const erDiagramDescription = 'Diagrama Entidad-Relación del Sistema de Reservas SkyLink Airlines que muestra todas las tablas y sus relaciones.';

// Estructura de directorios (para scripts SQL organizados)
export const directoryStructure = `skylink-db/
├── schema/
│   ├── 01-tables.sql
│   ├── 02-views.sql
│   ├── 03-functions.sql
│   ├── 04-procedures.sql
│   ├── 05-triggers.sql
│   ├── 06-events.sql
│   └── 07-security.sql
├── data/
│   ├── airports.sql
│   ├── airlines.sql
│   ├── routes.sql
│   ├── sample-flights.sql
│   └── test-passengers.sql
└── maintenance/
    ├── backup.sql
    ├── indexes.sql
    └── optimizations.sql`;

// Historial de versiones
export const versionHistory = [
  {
    version: '3.2.0',
    date: '2023-05-15',
    changes: 'Añadidas nuevas tablas para seguimiento de equipaje y estadísticas de vuelo.'
  },
  {
    version: '3.1.0',
    date: '2023-02-10',
    changes: 'Implementadas nuevas vistas para reportes gerenciales y optimizados varios procedimientos.'
  },
  {
    version: '3.0.0',
    date: '2022-11-05',
    changes: 'Migración completa a MySQL 8.0. Añadido soporte para JSON y mejoras en seguridad.'
  },
  {
    version: '2.5.0',
    date: '2022-07-20',
    changes: 'Reestructuración del sistema de reservas para soportar múltiples clases de tarifas.'
  },
  {
    version: '2.0.0',
    date: '2022-03-15',
    changes: 'Integración con sistema de fidelización. Añadido módulo de notificaciones.'
  },
  {
    version: '1.0.0',
    date: '2021-09-01',
    changes: 'Versión inicial del esquema de base de datos para el sistema de reservas.'
  }
];

// Convenciones de nomenclatura
export const namingConventions = [
  {
    title: 'Tablas',
    description: 'Nombres en plural, minúsculas, palabras separadas con guiones bajos.',
    example: 'passengers, flight_schedules, boarding_passes'
  },
  {
    title: 'Columnas',
    description: 'Minúsculas, palabras separadas con guiones bajos, clave primaria con sufijo _id.',
    example: 'first_name, departure_time, passenger_id'
  },
  {
    title: 'Claves Foráneas',
    description: 'Mismo nombre que la columna referenciada en la tabla principal.',
    example: 'flight_id, passenger_id, route_id'
  },
  {
    title: 'Índices',
    description: 'Prefijo idx_, seguido del nombre de la(s) columna(s).',
    example: 'idx_departure_time, idx_passenger_name'
  },
  {
    title: 'Procedimientos',
    description: 'Verbo seguido de sustantivo, palabras separadas con guiones bajos.',
    example: 'get_available_flights, create_booking, update_passenger_details'
  },
  {
    title: 'Funciones',
    description: 'Nombre descriptivo de su acción, palabras separadas con guiones bajos.',
    example: 'calculate_flight_duration, format_flight_number'
  },
  {
    title: 'Disparadores',
    description: 'Prefijo trg_, seguido de momento de ejecución, tabla y acción.',
    example: 'trg_before_insert_bookings, trg_after_update_flights'
  },
  {
    title: 'Vistas',
    description: 'Prefijo v_, seguido de nombre descriptivo.',
    example: 'v_upcoming_flights, v_passenger_bookings'
  }
];

// Exportar los datos
export const generalInfoData = {
  databaseStats,
  databaseEngine,
  erDiagramUrl,
  erDiagramDescription,
  directoryStructure,
  versionHistory,
  namingConventions
};
