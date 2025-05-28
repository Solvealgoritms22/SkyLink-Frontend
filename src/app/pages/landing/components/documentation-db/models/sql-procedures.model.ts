/**
 * Modelo de datos para las definiciones de procedimientos almacenados SQL
 */
export const proceduresScript = {
  sp_create_booking: `CREATE PROCEDURE sp_create_booking(IN p_passenger_id INT, IN p_flight_id INT, IN p_fare_class_id INT, OUT p_booking_code CHAR(6))
BEGIN
    -- Calcula tarifa y genera código de reserva
    DECLARE v_code CHAR(6);
    DECLARE v_amount DECIMAL(10,2);
    DECLARE v_multiplier DECIMAL(3,2);
    SELECT multiplier INTO v_multiplier FROM fare_classes WHERE fare_class_id = p_fare_class_id;
    SELECT base_fare INTO v_amount FROM flights WHERE flight_id = p_flight_id;
    SET v_amount = fn_calculate_fare(v_amount, v_multiplier);
    SET v_code = UPPER(SUBSTRING(MD5(RAND()),1,6));
    INSERT INTO bookings(booking_code, status, total_amount) VALUES (v_code,'Pending',v_amount);
    INSERT INTO booking_passengers(booking_id, passenger_id, fare_class_id)
    VALUES (LAST_INSERT_ID(), p_passenger_id, p_fare_class_id);
    SET p_booking_code = v_code;
END`,
  sp_confirm_booking: `CREATE PROCEDURE sp_confirm_booking(IN p_booking_code CHAR(6))
BEGIN
    UPDATE bookings SET status='Confirmed' WHERE booking_code = p_booking_code;
    INSERT INTO reservations_history(booking_id,status)
    SELECT booking_id,'Confirmed' FROM bookings WHERE booking_code=p_booking_code;
END`,
  sp_check_in_passenger: `CREATE PROCEDURE sp_check_in_passenger(IN p_ticket_id INT)
BEGIN
    INSERT INTO checkins(ticket_id,baggage_count) VALUES(p_ticket_id,0);
END`,
  sp_cancel_booking: `CREATE PROCEDURE sp_cancel_booking(IN p_booking_code CHAR(6))
BEGIN
    UPDATE bookings SET status='Cancelled' WHERE booking_code = p_booking_code;
    INSERT INTO reservations_history(booking_id,status)
    SELECT booking_id,'Cancelled' FROM bookings WHERE booking_code=p_booking_code;
END`,
  sp_assign_crew: `CREATE PROCEDURE sp_assign_crew(IN p_flight_id INT, IN p_staff_id INT, IN p_position VARCHAR(20))
BEGIN
    INSERT IGNORE INTO crew_assignments(flight_id,staff_id,position)
    VALUES(p_flight_id,p_staff_id,p_position);
END`,
  sp_add_payment: `CREATE PROCEDURE sp_add_payment(IN p_booking_code CHAR(6), IN p_amount DECIMAL(10,2), IN p_method VARCHAR(20))
BEGIN
    DECLARE v_booking_id INT;
    SELECT booking_id INTO v_booking_id FROM bookings WHERE booking_code=p_booking_code;
    INSERT INTO payments(booking_id,amount,method,status) VALUES(v_booking_id,p_amount,p_method,'Completed');
    UPDATE bookings SET total_amount = p_amount WHERE booking_id=v_booking_id;
END`,
  sp_upgrade_seat: `CREATE PROCEDURE sp_upgrade_seat(IN p_ticket_id INT, IN p_new_fare_class_id INT)
BEGIN
    UPDATE tickets SET fare_class_id=p_new_fare_class_id WHERE ticket_id=p_ticket_id;
END`,
  sp_create_flight: `CREATE PROCEDURE sp_create_flight(IN p_route_id INT, IN p_aircraft_id INT, IN p_departure DATETIME, IN p_arrival DATETIME, IN p_seq INT)
BEGIN
    DECLARE v_flight_number VARCHAR(10);
    SELECT iata_code INTO v_flight_number FROM airlines WHERE airline_id = (SELECT airline_id FROM routes WHERE route_id=p_route_id);
    SET v_flight_number = fn_flight_number_format(v_flight_number, p_seq);
    INSERT INTO flights(route_id, aircraft_id, flight_number, departure_time, arrival_time, base_fare)
    VALUES (p_route_id, p_aircraft_id, v_flight_number, p_departure, p_arrival, 100.00);
END`,
  sp_complete_maintenance: `CREATE PROCEDURE sp_complete_maintenance(IN p_log_id INT)
BEGIN
    UPDATE maintenance_logs SET status='Completed' WHERE log_id=p_log_id;
END`,
  sp_generate_daily_report: `CREATE PROCEDURE sp_generate_daily_report()
BEGIN
    SELECT flight_id, SUM(price_paid) AS revenue FROM tickets
    WHERE DATE(departure_time)=CURDATE() GROUP BY flight_id;
END`
};
