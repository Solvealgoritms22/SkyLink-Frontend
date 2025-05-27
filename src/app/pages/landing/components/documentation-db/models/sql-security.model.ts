/**
 * Modelo de datos para la configuración de seguridad SQL
 */
export const securityScript = `-- Creación de Roles
CREATE ROLE airline_admin;
CREATE ROLE reservation_agent;
CREATE ROLE reporting_user;

-- Creación de Usuarios
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'Admin@123';
CREATE USER 'agent_user'@'%' IDENTIFIED BY 'Agent@123';
CREATE USER 'report_user'@'%' IDENTIFIED BY 'Report@123';

-- Asignación de Privilegios
GRANT ALL PRIVILEGES ON airline_reservation.* TO airline_admin;
GRANT airline_admin TO 'admin_user'@'%';

GRANT SELECT, INSERT, UPDATE ON airline_reservation.bookings TO reservation_agent;
GRANT SELECT, INSERT, UPDATE ON airline_reservation.booking_passengers TO reservation_agent;
GRANT SELECT ON airline_reservation.flights TO reservation_agent;
GRANT reservation_agent TO 'agent_user'@'%';

GRANT SELECT ON airline_reservation.* TO reporting_user;
GRANT reporting_user TO 'report_user'@'%';

-- Configuración de Roles por Defecto
SET DEFAULT ROLE airline_admin TO 'admin_user'@'%';
SET DEFAULT ROLE reservation_agent TO 'agent_user'@'%';
SET DEFAULT ROLE reporting_user TO 'report_user'@'%';

FLUSH PRIVILEGES;`;
