/**
 * Modelo de datos para las definiciones de eventos SQL
 */
export const eventsScript = {
  ev_archive_old_flights: `CREATE EVENT ev_archive_old_flights ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE, '02:00:00'))
DO
  INSERT INTO audit_logs(table_name,operation,record_id,changed_by)
  SELECT 'flights','ARCHIVE', flight_id, 'SYSTEM' FROM flights
  WHERE departure_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);`,
  ev_update_flight_status: `CREATE EVENT ev_update_flight_status ON SCHEDULE EVERY 15 MINUTE
DO
  UPDATE flights SET status='Departed' WHERE status='Boarding' AND departure_time <= NOW();`,
  ev_cleanup_expired_bookings: `CREATE EVENT ev_cleanup_expired_bookings ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM bookings WHERE status='Pending' AND booking_date < DATE_SUB(NOW(), INTERVAL 24 HOUR);`,
  ev_send_departure_reminders: `CREATE EVENT ev_send_departure_reminders ON SCHEDULE EVERY 1 HOUR
DO
  INSERT INTO audit_logs(table_name,operation,record_id,changed_by)
  SELECT 'Reminder','SEND', flight_id, 'SYSTEM' FROM flights
  WHERE departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 HOUR);`,
  ev_award_loyalty_monthly: `CREATE EVENT ev_award_loyalty_monthly ON SCHEDULE EVERY 1 MONTH
STARTS (TIMESTAMP(DATE_FORMAT(NOW(),'%Y-%m-01'), '03:00:00'))
DO
  UPDATE loyalty_programs SET tier = fn_loyalty_tier(points_balance);`
};
