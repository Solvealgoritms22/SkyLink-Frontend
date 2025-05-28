/**
 * Modelo de datos detallados para seguridad SQL
 */

export interface DatabaseRole {
  name: string;
  description: string;
  permissions: {
    object: string;
    objectType: 'TABLE' | 'VIEW' | 'PROCEDURE' | 'FUNCTION' | 'EVENT' | 'TRIGGER' | 'DATABASE';
    privileges: string[];
  }[];
  assignedTo?: string[];
}

export interface DatabaseUser {
  username: string;
  description: string;
  roles: string[];
  directPermissions?: {
    object: string;
    objectType: 'TABLE' | 'VIEW' | 'PROCEDURE' | 'FUNCTION' | 'EVENT' | 'TRIGGER' | 'DATABASE';
    privileges: string[];
  }[];
}

export interface SecurityPolicy {
  name: string;
  description: string;
  details: string[];
}

export interface SecurityDetail {
  roles: DatabaseRole[];
  users: DatabaseUser[];
  passwordPolicy?: SecurityPolicy;
  auditPolicy?: SecurityPolicy;
  dataProtectionPolicy?: SecurityPolicy;
  bestPractices: string[];
  securityDiagram?: {
    url?: string;
    description: string;
  };
}

export const securityDetails: SecurityDetail = {
  roles: [
    {
      name: 'db_admin',
      description: 'Administrador de la base de datos con acceso completo a todos los objetos',
      permissions: [
        {
          object: '*',
          objectType: 'DATABASE',
          privileges: ['ALL PRIVILEGES']
        }
      ],
      assignedTo: ['admin_user']
    },
    {
      name: 'app_user',
      description: 'Rol utilizado por la aplicación para operaciones regulares',
      permissions: [
        {
          object: 'flights, airports, airlines, routes, passengers, bookings, booking_passengers, tickets',
          objectType: 'TABLE',
          privileges: ['SELECT', 'INSERT', 'UPDATE']
        },
        {
          object: 'vw_upcoming_flights, vw_flight_manifest, vw_seat_availability',
          objectType: 'VIEW',
          privileges: ['SELECT']
        },
        {
          object: 'sp_create_booking, sp_confirm_booking, sp_check_in_passenger',
          objectType: 'PROCEDURE',
          privileges: ['EXECUTE']
        },
        {
          object: 'fn_calculate_fare, fn_available_seats',
          objectType: 'FUNCTION',
          privileges: ['EXECUTE']
        }
      ],
      assignedTo: ['app_service_user', 'booking_system']
    },
    {
      name: 'reporting_user',
      description: 'Rol para generación de reportes y análisis de datos con acceso de solo lectura',
      permissions: [
        {
          object: '*',
          objectType: 'TABLE',
          privileges: ['SELECT']
        },
        {
          object: '*',
          objectType: 'VIEW',
          privileges: ['SELECT']
        },
        {
          object: 'fn_*',
          objectType: 'FUNCTION',
          privileges: ['EXECUTE']
        }
      ],
      assignedTo: ['report_generator', 'analytics_user']
    },
    {
      name: 'customer_support',
      description: 'Rol para personal de servicio al cliente con permisos limitados',
      permissions: [
        {
          object: 'bookings',
          objectType: 'TABLE',
          privileges: ['SELECT', 'UPDATE']
        },
        {
          object: 'passengers, tickets, boarding_passes',
          objectType: 'TABLE',
          privileges: ['SELECT']
        },
        {
          object: 'sp_confirm_booking, sp_cancel_booking',
          objectType: 'PROCEDURE',
          privileges: ['EXECUTE']
        }
      ],
      assignedTo: ['support_team', 'customer_service']
    }
  ],
  users: [
    {
      username: 'admin_user',
      description: 'Usuario administrador principal de la base de datos',
      roles: ['db_admin']
    },
    {
      username: 'app_service_user',
      description: 'Usuario de servicio utilizado por la aplicación principal',
      roles: ['app_user']
    },
    {
      username: 'report_generator',
      description: 'Usuario para generación automática de reportes periódicos',
      roles: ['reporting_user']
    },
    {
      username: 'customer_service',
      description: 'Usuario genérico para el equipo de servicio al cliente',
      roles: ['customer_support']
    },
    {
      username: 'backup_operator',
      description: 'Usuario para operaciones de respaldo con permisos específicos',
      roles: [],
      directPermissions: [
        {
          object: '*',
          objectType: 'DATABASE',
          privileges: ['BACKUP', 'CONNECT', 'PROCESS']
        }
      ]
    }
  ],
  passwordPolicy: {
    name: 'Política de contraseñas',
    description: 'Reglas para asegurar contraseñas fuertes y gestión segura de credenciales',
    details: [
      'Mínimo 12 caracteres de longitud',
      'Al menos una letra mayúscula, una minúscula, un número y un carácter especial',
      'Cambio obligatorio cada 90 días',
      'No se permiten las últimas 5 contraseñas usadas',
      'Bloqueo de cuenta tras 5 intentos fallidos',
      'Tiempo máximo de sesión inactiva: 30 minutos'
    ]
  },
  auditPolicy: {
    name: 'Política de auditoría',
    description: 'Configuración para el registro y monitoreo de actividades en la base de datos',
    details: [
      'Registro de todos los inicios de sesión exitosos y fallidos',
      'Registro de todas las operaciones DDL (CREATE, ALTER, DROP)',
      'Registro de operaciones DML en tablas críticas (bookings, payments)',
      'Registro de cambios en permisos y roles',
      'Retención de logs de auditoría por 2 años',
      'Revisión mensual de actividades sospechosas'
    ]
  },
  dataProtectionPolicy: {
    name: 'Política de protección de datos',
    description: 'Medidas para proteger datos sensibles y personales',
    details: [
      'Encriptación de datos personales en columnas sensibles (número de tarjeta, documentos de identidad)',
      'Enmascaramiento dinámico de datos para usuarios con rol customer_support',
      'Cifrado TLS 1.3 para conexiones a la base de datos',
      'Respaldos encriptados con rotación de claves',
      'Implementación de campos de auditoría (created_by, modified_by) en todas las tablas',
      'Procedimiento documentado para solicitudes de eliminación de datos (RGPD)'
    ]
  },
  bestPractices: [
    'Utilizar conexiones de menor privilegio para la aplicación',
    'Implementar cifrado en tránsito y en reposo',
    'Revisar y rotar credenciales regularmente',
    'Aplicar actualizaciones de seguridad inmediatamente',
    'Realizar auditorías de seguridad periódicas',
    'Implementar filtrado de filas basado en roles (Row-Level Security)',
    'Usar procedimientos almacenados para operaciones críticas en lugar de SQL directo',
    'Mantener ambientes de desarrollo y producción estrictamente separados'
  ],
  securityDiagram: {
    description: 'El diagrama muestra los diferentes niveles de acceso a la base de datos, desde los usuarios con mayor privilegio (db_admin) hasta los roles más restrictivos, ilustrando la estructura jerárquica de permisos y las capas de protección implementadas.'
  }
};
