/**
 * Modelo de datos detallados para funciones SQL
 */

import { TableColumn } from './sql-data-dictionary.model';

export interface FunctionParameter {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface FunctionDetail {
  name: string;
  description: string;
  parameters: FunctionParameter[];
  returnType: string;
  returnTypeDescription: string;
  relatedTables: {
    tableName: string;
    relationship: string;
    description: string;
  }[];
  implementationNotes: string;
  useCases: string[];
  exampleUsages: {
    description: string;
    sql: string;
    result?: string;
  }[];
}

export const functionDetails: { [key: string]: FunctionDetail } = {
  fn_calculate_fare: {
    name: 'fn_calculate_fare',
    description: 'Calcula la tarifa final multiplicando la tarifa base por el multiplicador de la clase',
    parameters: [
      {
        name: 'base',
        type: 'DECIMAL(10,2)',
        description: 'Tarifa base del vuelo'
      },
      {
        name: 'multiplier',
        type: 'DECIMAL(5,2)',
        description: 'Multiplicador correspondiente a la clase de tarifa'
      }
    ],
    returnType: 'DECIMAL(10,2)',
    returnTypeDescription: 'Tarifa final calculada con el multiplicador aplicado',
    relatedTables: [
      {
        tableName: 'flights',
        relationship: 'Consulta',
        description: 'Obtiene la tarifa base desde la tabla de vuelos'
      },
      {
        tableName: 'fare_classes',
        relationship: 'Consulta',
        description: 'Obtiene el multiplicador desde la tabla de clases de tarifa'
      }
    ],
    implementationNotes: 'Esta es una función determinística simple que multiplica dos valores. Se utiliza para calcular tarifas según la clase de vuelo seleccionada.',
    useCases: [
      'Cálculo de precios al crear reservas',
      'Mostrar tarifas disponibles para un vuelo específico',
      'Generar reportes de ingresos proyectados'
    ],
    exampleUsages: [
      {
        description: 'Calcular tarifa de primera clase para un vuelo',
        sql: "SELECT flight_number, base_fare, 1.8 AS multiplier, fn_calculate_fare(base_fare, 1.8) AS first_class_fare\nFROM flights\nWHERE flight_id = 101;",
        result: "+---------------+-----------+------------+------------------+\n| flight_number | base_fare | multiplier | first_class_fare |\n+---------------+-----------+------------+------------------+\n| SL1234        | 250.00    | 1.8        | 450.00           |\n+---------------+-----------+------------+------------------+"
      }
    ]
  },
  fn_distance_km: {
    name: 'fn_distance_km',
    description: 'Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine',
    parameters: [
      {
        name: 'lat1',
        type: 'DECIMAL(9,6)',
        description: 'Latitud del punto de origen'
      },
      {
        name: 'lon1',
        type: 'DECIMAL(9,6)',
        description: 'Longitud del punto de origen'
      },
      {
        name: 'lat2',
        type: 'DECIMAL(9,6)',
        description: 'Latitud del punto de destino'
      },
      {
        name: 'lon2',
        type: 'DECIMAL(9,6)',
        description: 'Longitud del punto de destino'
      }
    ],
    returnType: 'INT',
    returnTypeDescription: 'Distancia calculada en kilómetros (redondeada)',
    relatedTables: [
      {
        tableName: 'airports',
        relationship: 'Consulta',
        description: 'Obtiene coordenadas geográficas de los aeropuertos'
      },
      {
        tableName: 'routes',
        relationship: 'Actualización',
        description: 'Actualiza la distancia calculada en las rutas'
      }
    ],
    implementationNotes: 'Esta función utiliza la fórmula de Haversine para calcular la distancia entre dos puntos geográficos. El valor 6371 es el radio promedio de la Tierra en kilómetros.',
    useCases: [
      'Cálculo automático de distancias al crear nuevas rutas',
      'Estimación de consumo de combustible',
      'Cálculo de millas para programas de fidelización de clientes'
    ],
    exampleUsages: [
      {
        description: 'Calcular distancia entre Santo Domingo y Santiago',
        sql: "SELECT a1.name AS origin, a2.name AS destination, \nfn_distance_km(a1.latitude, a1.longitude, a2.latitude, a2.longitude) AS distance_km\nFROM airports a1, airports a2\nWHERE a1.iata_code = 'SDQ' AND a2.iata_code = 'STI';",
        result: "+-------------------------------------+----------------------------------+-------------+\n| origin                               | destination                      | distance_km |\n+-------------------------------------+----------------------------------+-------------+\n| Aeropuerto Internacional Las Américas| Aeropuerto Internacional Cibao   | 158         |\n+-------------------------------------+----------------------------------+-------------+"
      }
    ]
  },
  fn_flight_duration: {
    name: 'fn_flight_duration',
    description: 'Calcula la duración de un vuelo en minutos basado en sus tiempos de salida y llegada',
    parameters: [
      {
        name: 'dep',
        type: 'DATETIME',
        description: 'Fecha y hora de salida del vuelo'
      },
      {
        name: 'arr',
        type: 'DATETIME',
        description: 'Fecha y hora de llegada del vuelo'
      }
    ],
    returnType: 'INT',
    returnTypeDescription: 'Duración del vuelo en minutos',
    relatedTables: [
      {
        tableName: 'flights',
        relationship: 'Consulta',
        description: 'Utiliza los campos departure_time y arrival_time de la tabla flights'
      }
    ],
    implementationNotes: 'Función simple que utiliza TIMESTAMPDIFF para calcular la diferencia en minutos entre dos fechas/horas.',
    useCases: [
      'Mostrar la duración de los vuelos en la interfaz de usuario',
      'Filtrar vuelos por duración',
      'Cálculos para la programación de tripulación'
    ],
    exampleUsages: [
      {
        description: 'Listar vuelos con su duración',
        sql: "SELECT flight_number, departure_time, arrival_time,\nfn_flight_duration(departure_time, arrival_time) AS duration_minutes\nFROM flights\nORDER BY duration_minutes DESC\nLIMIT 3;",
        result: "+---------------+---------------------+---------------------+-----------------+\n| flight_number | departure_time      | arrival_time        | duration_minutes |\n+---------------+---------------------+---------------------+-----------------+\n| SL1492        | 2023-07-15 08:30:00 | 2023-07-15 14:45:00 | 375             |\n| SL2056        | 2023-07-16 10:15:00 | 2023-07-16 15:20:00 | 305             |\n| SL3341        | 2023-07-15 16:40:00 | 2023-07-15 20:30:00 | 230             |\n+---------------+---------------------+---------------------+-----------------+"
      }
    ]
  },
  fn_available_seats: {
    name: 'fn_available_seats',
    description: 'Calcula el número de asientos disponibles para un vuelo específico y una clase de tarifa',
    parameters: [
      {
        name: 'flight',
        type: 'INT',
        description: 'ID del vuelo'
      },
      {
        name: 'fare',
        type: 'INT',
        description: 'ID de la clase de tarifa'
      }
    ],
    returnType: 'INT',
    returnTypeDescription: 'Número de asientos disponibles (total - vendidos)',
    relatedTables: [
      {
        tableName: 'seat_inventory',
        relationship: 'Consulta',
        description: 'Obtiene información sobre asientos totales y vendidos'
      },
      {
        tableName: 'flights',
        relationship: 'Indirecta',
        description: 'Se relaciona con el vuelo especificado'
      }
    ],
    implementationNotes: 'Esta función lee datos de la tabla seat_inventory para determinar el inventario actual de asientos. Calcula la disponibilidad restando los asientos vendidos del total asignado para esa clase de tarifa.',
    useCases: [
      'Verificar disponibilidad antes de crear una reserva',
      'Mostrar asientos disponibles por clase en el sistema de reservas',
      'Generar alertas cuando hay pocos asientos disponibles'
    ],
    exampleUsages: [
      {
        description: 'Verificar asientos disponibles por clase para un vuelo',
        sql: "SELECT fc.name AS fare_class, \nfn_available_seats(101, fc.fare_class_id) AS available_seats\nFROM fare_classes fc\nORDER BY fc.price_multiplier DESC;",
        result: "+-------------+----------------+\n| fare_class  | available_seats |\n+-------------+----------------+\n| First Class | 6              |\n| Business    | 12             |\n| Economy     | 78             |\n+-------------+----------------+"
      }
    ]
  },
  fn_flight_occupancy: {
    name: 'fn_flight_occupancy',
    description: 'Calcula el porcentaje de ocupación de un vuelo considerando todas las clases de tarifa',
    parameters: [
      {
        name: 'flight',
        type: 'INT',
        description: 'ID del vuelo'
      }
    ],
    returnType: 'DECIMAL(5,2)',
    returnTypeDescription: 'Porcentaje de ocupación del vuelo (0-100)',
    relatedTables: [
      {
        tableName: 'seat_inventory',
        relationship: 'Consulta',
        description: 'Obtiene información sobre asientos totales y vendidos por clase'
      }
    ],
    implementationNotes: 'Esta función calcula la ocupación como porcentaje sumando todos los asientos vendidos y dividiéndolos por el total de asientos disponibles. El resultado se multiplica por 100 para obtener el porcentaje.',
    useCases: [
      'Mostrar estadísticas de ocupación para gerencia',
      'Identificar vuelos con baja ocupación para promociones',
      'Analizar tendencias de ocupación por ruta o temporada'
    ],
    exampleUsages: [
      {
        description: 'Ver ocupación de próximos vuelos',
        sql: "SELECT f.flight_number, f.departure_time, \nfn_flight_occupancy(f.flight_id) AS occupancy_percentage\nFROM flights f\nWHERE f.departure_time > NOW()\nORDER BY occupancy_percentage DESC\nLIMIT 5;",
        result: "+---------------+---------------------+---------------------+\n| flight_number | departure_time      | occupancy_percentage |\n+---------------+---------------------+---------------------+\n| SL5501        | 2023-08-01 07:00:00 | 92.50               |\n| SL1025        | 2023-07-20 14:30:00 | 87.25               |\n| SL3874        | 2023-07-18 10:15:00 | 80.00               |\n| SL2138        | 2023-07-25 16:45:00 | 74.50               |\n| SL7246        | 2023-07-19 09:30:00 | 68.75               |\n+---------------+---------------------+---------------------+"
      }
    ]  },
    fn_flight_number_format: {
    name: 'fn_flight_number_format',
    description: 'Genera un número de vuelo formateado según el estándar',
    parameters: [
      {
        name: 'airline',
        type: 'CHAR(2)',
        description: 'Código IATA de la aerolínea (2 caracteres)'
      },
      {
        name: 'seq',
        type: 'INT',
        description: 'Número secuencial del vuelo'
      }
    ],
    returnType: 'VARCHAR(10)',
    returnTypeDescription: 'Número de vuelo formateado que combina el código de aerolínea y el número secuencial rellenado con ceros',
    relatedTables: [
      {
        tableName: 'flights',
        relationship: 'Genera',
        description: 'Esta función se utiliza para generar los números de vuelo almacenados en la tabla de vuelos'
      },
      {
        tableName: 'airlines',
        relationship: 'Utiliza',
        description: 'Utiliza el código IATA de la aerolínea como prefijo del número de vuelo'
      }
    ],
    implementationNotes: 'La función concatena el código de aerolínea con el número secuencial rellenado con ceros a la izquierda hasta completar 4 dígitos, siguiendo el formato estándar de la industria aérea.',
    useCases: [
      'Generar números de vuelo al crear nuevos vuelos programados',
      'Estandarizar el formato de los números de vuelo en toda la aplicación',
      'Facilitar la búsqueda de vuelos por su identificador único'
    ],
    exampleUsages: [
      {
        description: 'Crear números de vuelo para diferentes aerolíneas',
        sql: "SELECT fn_flight_number_format('SL', 123) AS SkyLink_Flight,\n       fn_flight_number_format('AA', 5678) AS American_Flight;",
        result: "+---------------+----------------+\n| SkyLink_Flight | American_Flight |\n+---------------+----------------+\n| SL0123        | AA5678         |\n+---------------+----------------+"
      }
    ]
  },
  
  fn_total_baggage_weight: {
    name: 'fn_total_baggage_weight',
    description: 'Calcula el peso total del equipaje para un boleto',
    parameters: [
      {
        name: 'ticket',
        type: 'INT',
        description: 'ID del boleto'
      }
    ],
    returnType: 'DECIMAL(7,2)',
    returnTypeDescription: 'Peso total en kilogramos del equipaje registrado para el boleto',
    relatedTables: [
      {
        tableName: 'baggage',
        relationship: 'Consulta',
        description: 'Obtiene los registros de equipaje asociados al boleto'
      },
      {
        tableName: 'tickets',
        relationship: 'Consulta',
        description: 'Se relaciona con el boleto especificado'
      }
    ],
    implementationNotes: 'La función suma el peso de todas las piezas de equipaje asociadas a un boleto. Si no hay equipaje, devuelve 0.',
    useCases: [
      'Verificar límites de peso en el equipaje',
      'Calcular costos adicionales por exceso de equipaje',
      'Mostrar información de equipaje en tarjetas de embarque'
    ],
    exampleUsages: [
      {
        description: 'Obtener peso total de equipaje por boleto',
        sql: "SELECT t.ticket_number, p.first_name, p.last_name, \nfn_total_baggage_weight(t.ticket_id) AS total_kg\nFROM tickets t\nJOIN passengers p ON t.passenger_id = p.passenger_id\nWHERE t.flight_id = 101\nORDER BY total_kg DESC\nLIMIT 3;",
        result: "+---------------+------------+-----------+----------+\n| ticket_number | first_name | last_name | total_kg |\n+---------------+------------+-----------+----------+\n| SL10134875    | Robert     | Johnson   | 27.50    |\n| SL10134882    | Maria      | Garcia    | 23.00    |\n| SL10134890    | John       | Smith     | 18.75    |\n+---------------+------------+-----------+----------+"
      }
    ]
  },
  
  fn_seats_by_class: {
    name: 'fn_seats_by_class',
    description: 'Devuelve el total de asientos para una clase en un vuelo',
    parameters: [
      {
        name: 'flight',
        type: 'INT',
        description: 'ID del vuelo'
      },
      {
        name: 'fclass',
        type: 'INT',
        description: 'ID de la clase de tarifa'
      }
    ],
    returnType: 'INT',
    returnTypeDescription: 'Número total de asientos asignados para la clase especificada en el vuelo',
    relatedTables: [
      {
        tableName: 'seat_inventory',
        relationship: 'Consulta',
        description: 'Obtiene el inventario de asientos para el vuelo y clase especificados'
      },
      {
        tableName: 'aircraft',
        relationship: 'Indirecta',
        description: 'Relacionado a través de la configuración de asientos de la aeronave'
      }
    ],
    implementationNotes: 'Esta función consulta la tabla de inventario de asientos para devolver el total de asientos asignados a una clase de tarifa específica en un vuelo.',
    useCases: [
      'Visualización de la distribución de asientos por clase',
      'Planificación de configuraciones de aeronaves',
      'Cálculos para optimizar la asignación de asientos'
    ],
    exampleUsages: [
      {
        description: 'Obtener distribución de asientos por clase para un vuelo',
        sql: "SELECT fc.name AS fare_class, \nfn_seats_by_class(101, fc.fare_class_id) AS total_seats\nFROM fare_classes fc\nORDER BY fc.price_multiplier DESC;",
        result: "+-------------+-------------+\n| fare_class  | total_seats |\n+-------------+-------------+\n| First Class | 8           |\n| Business    | 24          |\n| Economy     | 112         |\n+-------------+-------------+"
      }
    ]
  },
  
  fn_format_currency: {
    name: 'fn_format_currency',
    description: 'Formatea un valor monetario con símbolo y decimales',
    parameters: [
      {
        name: 'amount',
        type: 'DECIMAL(10,2)',
        description: 'Cantidad monetaria a formatear'
      },
      {
        name: 'currency_code',
        type: 'CHAR(3)',
        description: 'Código de moneda (USD, EUR, etc.)',
        defaultValue: 'USD'
      }
    ],
    returnType: 'VARCHAR(20)',
    returnTypeDescription: 'Valor monetario formateado con símbolo de moneda y dos decimales',
    relatedTables: [],
    implementationNotes: 'Esta función aplica el formato adecuado para mostrar valores monetarios de forma consistente en toda la aplicación. Agrega el símbolo correspondiente según la moneda especificada.',
    useCases: [
      'Mostrar precios en la interfaz de usuario',
      'Formatear valores monetarios en reportes',
      'Estandarizar la visualización de precios en múltiples monedas'
    ],
    exampleUsages: [
      {
        description: 'Formatear diferentes valores monetarios',
        sql: "SELECT fn_format_currency(1234.56, 'USD') AS dollars, \n       fn_format_currency(1234.56, 'EUR') AS euros, \n       fn_format_currency(1234.56, 'GBP') AS pounds;",
        result: "+-------------+-------------+-------------+\n| dollars     | euros       | pounds      |\n+-------------+-------------+-------------+\n| $1,234.56   | €1,234.56   | £1,234.56   |\n+-------------+-------------+-------------+"
      }
    ]
  },
  
  fn_loyalty_tier: {
    name: 'fn_loyalty_tier',
    description: 'Determina el nivel de lealtad de un miembro según la cantidad de puntos acumulados. Asigna un nivel (Bronze, Silver, Gold, Platinum) en función de los umbrales de puntos.',
    parameters: [
      {
        name: 'points',
        type: 'INT',
        description: 'Cantidad de puntos acumulados por el miembro.'
      }
    ],
    returnType: 'VARCHAR(10)',
    returnTypeDescription: 'Nivel de lealtad asignado: Bronze, Silver, Gold o Platinum.',
    relatedTables: [
      {
        tableName: 'loyalty_members',
        relationship: 'Consulta',
        description: 'Se utiliza para obtener el saldo de puntos de cada miembro.'
      },
      {
        tableName: 'loyalty_programs',
        relationship: 'Actualización',
        description: 'Se actualiza el nivel de lealtad del miembro en base al resultado de la función.'
      }
    ],
    implementationNotes: 'La función utiliza una estructura CASE para asignar el nivel de lealtad según los umbrales de puntos: Platinum (>=75000), Gold (>=40000), Silver (>=15000), Bronze (<15000). Es determinística y puede usarse en triggers o actualizaciones masivas.',
    useCases: [
      'Actualizar automáticamente el nivel de lealtad al modificar el saldo de puntos.',
      'Mostrar el nivel de lealtad en el perfil del usuario.',
      'Filtrar o segmentar clientes por nivel de lealtad en reportes.',
      'Aplicar beneficios o promociones según el nivel de lealtad.'
    ],
    exampleUsages: [
      {
        description: 'Obtener el nivel de lealtad para un miembro con 42,000 puntos.',
        sql: "SELECT fn_loyalty_tier(42000) AS loyalty_tier;",
        result: "+--------------+\n| loyalty_tier |\n+--------------+\n| Gold         |\n+--------------+"
      },
      {
        description: 'Actualizar el nivel de todos los miembros en la tabla loyalty_programs.',
        sql: "UPDATE loyalty_programs SET tier = fn_loyalty_tier(points_balance);"
      }
    ]
  }
};
