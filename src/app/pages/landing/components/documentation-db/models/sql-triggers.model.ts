/**
 * Modelo de datos para las definiciones de triggers SQL
 */
export const triggersScript = {
  trg_after_booking_confirm: `CREATE TRIGGER trg_after_booking_confirm AFTER UPDATE ON bookings FOR EACH ROW
BEGIN
    IF NEW.status='Confirmed' AND OLD.status!='Confirmed' THEN
        INSERT INTO audit_logs(table_name,operation,record_id,changed_by)
        VALUES('bookings','UPDATE',NEW.booking_id,USER());
    END IF;
END`,
  trg_after_payment_insert: `CREATE TRIGGER trg_after_payment_insert AFTER INSERT ON payments FOR EACH ROW
BEGIN
    UPDATE bookings SET status='Confirmed' WHERE booking_id = NEW.booking_id;
END`,
  trg_checkin_auto_bp: `CREATE TRIGGER trg_checkin_auto_bp
AFTER INSERT ON checkins FOR EACH ROW
BEGIN
    INSERT INTO boarding_passes(checkin_id, gate, boarding_time, seat_number)
    SELECT NEW.checkin_id, 'TBD', DATE_ADD(NOW(), INTERVAL 30 MINUTE), seat_number
      FROM tickets WHERE ticket_id = NEW.ticket_id;
END;`,
  trg_after_ticket_insert: `CREATE TRIGGER trg_after_ticket_insert AFTER INSERT ON tickets FOR EACH ROW
BEGIN
    UPDATE seat_inventory SET seats_sold = seats_sold + 1
    WHERE flight_id = NEW.flight_id AND fare_class_id = NEW.fare_class_id;
END`,
  trg_after_ticket_delete: `CREATE TRIGGER trg_after_ticket_delete AFTER DELETE ON tickets FOR EACH ROW
BEGIN
    UPDATE seat_inventory SET seats_sold = seats_sold - 1
    WHERE flight_id = OLD.flight_id AND fare_class_id = OLD.fare_class_id;
END`,
  trg_after_maintenance_insert: `CREATE TRIGGER trg_after_maintenance_insert AFTER INSERT ON maintenance_logs FOR EACH ROW
BEGIN
    UPDATE flights SET status='Maintenance' WHERE aircraft_id = NEW.aircraft_id;
END`,
  trg_after_maintenance_complete: `CREATE TRIGGER trg_after_maintenance_complete AFTER UPDATE ON maintenance_logs FOR EACH ROW
BEGIN
    IF NEW.status='Completed' AND OLD.status!='Completed' THEN
        UPDATE flights SET status='Scheduled' WHERE aircraft_id = NEW.aircraft_id AND status='Maintenance';
    END IF;
END`,
  trg_after_loyalty_transaction: `CREATE TRIGGER trg_after_loyalty_transaction AFTER INSERT ON booking_passengers FOR EACH ROW
BEGIN
    UPDATE loyalty_programs SET points_balance = points_balance + NEW.loyalty_points_awarded
    WHERE passenger_id = NEW.passenger_id;
END`,
  trg_flight_status_update: `CREATE TRIGGER trg_flight_status_update AFTER UPDATE ON flights FOR EACH ROW
BEGIN
    IF NEW.status <> OLD.status THEN
        INSERT INTO flight_status_history(flight_id,status) VALUES(NEW.flight_id, NEW.status);
    END IF;
END`,
  trg_audit_delete_booking: `CREATE TRIGGER trg_audit_delete_booking AFTER DELETE ON bookings FOR EACH ROW
BEGIN
    INSERT INTO audit_logs(table_name,operation,record_id,changed_by)
    VALUES('bookings','DELETE',OLD.booking_id,USER());
END`
};
