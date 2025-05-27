/**
 * Modelo de datos para las definiciones de tablas SQL
 */
export const tablesScript = {
  airports: `CREATE TABLE airports (
  airport_id      INT AUTO_INCREMENT PRIMARY KEY,
  iata_code       CHAR(3) NOT NULL UNIQUE,
  name            VARCHAR(100) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  country         VARCHAR(100) NOT NULL,
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  timezone        VARCHAR(50)
);`,
  airlines: `CREATE TABLE airlines (
  airline_id      INT AUTO_INCREMENT PRIMARY KEY,
  iata_code       CHAR(2) NOT NULL UNIQUE,
  name            VARCHAR(100) NOT NULL,
  call_sign       VARCHAR(50)
);`,
  aircraft: `CREATE TABLE aircraft (
  aircraft_id     INT AUTO_INCREMENT PRIMARY KEY,
  tail_number     VARCHAR(10) NOT NULL UNIQUE,
  airline_id      INT NOT NULL,
  model           VARCHAR(50) NOT NULL,
  seat_capacity   INT NOT NULL,
  manufacture_year SMALLINT,
  FOREIGN KEY (airline_id) REFERENCES airlines(airline_id)
);`,
  routes: `CREATE TABLE routes (
  route_id        INT AUTO_INCREMENT PRIMARY KEY,
  airline_id      INT NOT NULL,
  origin_id       INT NOT NULL,
  destination_id  INT NOT NULL,
  distance_km     INT,
  FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
  FOREIGN KEY (origin_id) REFERENCES airports(airport_id),
  FOREIGN KEY (destination_id) REFERENCES airports(airport_id)
);`,
  flights: `CREATE TABLE flights (
  flight_id       INT AUTO_INCREMENT PRIMARY KEY,
  route_id        INT NOT NULL,
  aircraft_id     INT NOT NULL,
  flight_number   VARCHAR(10) NOT NULL,
  departure_time  DATETIME NOT NULL,
  arrival_time    DATETIME NOT NULL,
  status          ENUM('Scheduled','Boarding','Departed','Arrived','Cancelled','Delayed','Maintenance') DEFAULT 'Scheduled',
  base_fare       DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (route_id) REFERENCES routes(route_id),
  FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id)
);`,
  passengers: `CREATE TABLE passengers (
  passenger_id    INT AUTO_INCREMENT PRIMARY KEY,
  first_name      VARCHAR(50),
  last_name       VARCHAR(50),
  dob             DATE,
  email           VARCHAR(100),
  phone           VARCHAR(20),
  loyalty_id      INT
);`,
  fare_classes: `CREATE TABLE fare_classes (
  fare_class_id   INT AUTO_INCREMENT PRIMARY KEY,
  code            CHAR(1) NOT NULL UNIQUE,
  description     VARCHAR(50),
  multiplier      DECIMAL(3,2) NOT NULL
);`,
  flight_fares: `CREATE TABLE flight_fares (
  flight_id       INT NOT NULL,
  fare_class_id   INT NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  seats_available INT NOT NULL,
  PRIMARY KEY (flight_id, fare_class_id),
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
  FOREIGN KEY (fare_class_id) REFERENCES fare_classes(fare_class_id)
);`,
  loyalty_programs: `CREATE TABLE loyalty_programs (
  loyalty_id      INT AUTO_INCREMENT PRIMARY KEY,
  passenger_id    INT NOT NULL,
  tier            ENUM('Bronze','Silver','Gold','Platinum') DEFAULT 'Bronze',
  points_balance  INT DEFAULT 0,
  FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id)
);`,
  bookings: `CREATE TABLE bookings (
  booking_id      INT AUTO_INCREMENT PRIMARY KEY,
  booking_code    CHAR(6) NOT NULL UNIQUE,
  booking_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status          ENUM('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  total_amount    DECIMAL(10,2) DEFAULT 0
);`,
  booking_passengers: `CREATE TABLE booking_passengers (
  booking_id      INT NOT NULL,
  passenger_id    INT NOT NULL,
  fare_class_id   INT NOT NULL,
  loyalty_points_awarded INT DEFAULT 0,
  PRIMARY KEY (booking_id, passenger_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
  FOREIGN KEY (fare_class_id) REFERENCES fare_classes(fare_class_id)
);`,
  tickets: `CREATE TABLE tickets (
  ticket_id       INT AUTO_INCREMENT PRIMARY KEY,
  booking_id      INT NOT NULL,
  flight_id       INT NOT NULL,
  passenger_id    INT NOT NULL,
  seat_number     VARCHAR(5),
  fare_class_id   INT NOT NULL,
  price_paid      DECIMAL(10,2) NOT NULL,
  ticket_status   ENUM('Active','Refunded','Used','Cancelled') DEFAULT 'Active',
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
  FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
  FOREIGN KEY (fare_class_id) REFERENCES fare_classes(fare_class_id)
);`,
  payments: `CREATE TABLE payments (
  payment_id      INT AUTO_INCREMENT PRIMARY KEY,
  booking_id      INT NOT NULL,
  payment_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount          DECIMAL(10,2) NOT NULL,
  method          ENUM('CreditCard','DebitCard','Cash','Transfer') NOT NULL,
  status          ENUM('Pending','Completed','Failed','Refunded') DEFAULT 'Pending',
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);`,
  baggage: `CREATE TABLE baggage (
  baggage_id      INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id       INT NOT NULL,
  weight_kg       DECIMAL(5,2),
  bag_tag         VARCHAR(20) UNIQUE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);`,
  staff: `CREATE TABLE staff (
  staff_id        INT AUTO_INCREMENT PRIMARY KEY,
  first_name      VARCHAR(50),
  last_name       VARCHAR(50),
  role            ENUM('Pilot','CoPilot','CabinCrew','GroundStaff','Engineer'),
  hire_date       DATE,
  airline_id      INT,
  FOREIGN KEY (airline_id) REFERENCES airlines(airline_id)
);`,
  crew_assignments: `CREATE TABLE crew_assignments (
  flight_id   INT NOT NULL,
  staff_id    INT NOT NULL,
  position    ENUM('Captain','FirstOfficer','Purser','FlightAttendant','Engineer'),
  PRIMARY KEY (flight_id, staff_id),
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);`,
  checkins: `CREATE TABLE checkins (
  checkin_id      INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id       INT NOT NULL,
  checkin_time    DATETIME DEFAULT CURRENT_TIMESTAMP,
  baggage_count   INT DEFAULT 0,
  FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);`,
  boarding_passes: `CREATE TABLE boarding_passes (
  bp_id           INT AUTO_INCREMENT PRIMARY KEY,
  checkin_id      INT NOT NULL,
  gate            VARCHAR(10),
  boarding_time   DATETIME,
  seat_number     VARCHAR(5),
  FOREIGN KEY (checkin_id) REFERENCES checkins(checkin_id)
);`,
  maintenance_logs: `CREATE TABLE maintenance_logs (
  log_id          INT AUTO_INCREMENT PRIMARY KEY,
  aircraft_id     INT NOT NULL,
  maintenance_date DATE NOT NULL,
  description     TEXT,
  status          ENUM('Scheduled','InProgress','Completed') DEFAULT 'Scheduled',
  FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id)
);`,
  flight_status_history: `CREATE TABLE flight_status_history (
  status_id       INT AUTO_INCREMENT PRIMARY KEY,
  flight_id       INT NOT NULL,
  status          ENUM('Scheduled','Boarding','Departed','Arrived','Cancelled','Delayed','Maintenance'),
  changed_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);`,
  audit_logs: `CREATE TABLE audit_logs (
  audit_id        INT AUTO_INCREMENT PRIMARY KEY,
  table_name      VARCHAR(50),
  operation       ENUM('INSERT','UPDATE','DELETE'),
  record_id       INT,
  changed_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  changed_by      VARCHAR(50)
);`,
  reservations_history: `CREATE TABLE reservations_history (
  hist_id         INT AUTO_INCREMENT PRIMARY KEY,
  booking_id      INT,
  status          ENUM('Pending','Confirmed','Cancelled'),
  changed_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
  seat_inventory: `CREATE TABLE seat_inventory (
  flight_id       INT NOT NULL,
  fare_class_id   INT NOT NULL,
  seats_total     INT NOT NULL,
  seats_sold      INT NOT NULL DEFAULT 0,
  PRIMARY KEY (flight_id, fare_class_id),
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
  FOREIGN KEY (fare_class_id) REFERENCES fare_classes(fare_class_id)
);`
};
