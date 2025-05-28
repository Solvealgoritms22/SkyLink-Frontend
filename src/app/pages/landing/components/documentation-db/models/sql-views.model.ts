/**
 * Modelo de datos para las definiciones de vistas SQL
 */
export const viewsScript = {
  vw_upcoming_flights: `CREATE VIEW vw_upcoming_flights AS
SELECT f.flight_id, f.flight_number, a1.iata_code AS origin, a2.iata_code AS destination,
       f.departure_time, f.arrival_time, f.status
FROM flights f JOIN routes r ON f.route_id = r.route_id
JOIN airports a1 ON r.origin_id = a1.airport_id
JOIN airports a2 ON r.destination_id = a2.airport_id
WHERE f.departure_time >= NOW();`,
  vw_flight_manifest: `CREATE VIEW vw_flight_manifest AS
SELECT f.flight_number, p.first_name, p.last_name, t.seat_number
FROM tickets t JOIN flights f ON t.flight_id = f.flight_id
JOIN passengers p ON t.passenger_id = p.passenger_id;`,
  vw_flight_revenue: `CREATE VIEW vw_flight_revenue AS
SELECT f.flight_number, SUM(t.price_paid) AS revenue
FROM tickets t JOIN flights f ON t.flight_id = f.flight_id
GROUP BY f.flight_number;`,
  vw_loyalty_member_points: `CREATE VIEW vw_loyalty_member_points AS
SELECT p.passenger_id, p.first_name, p.last_name, lp.points_balance
FROM passengers p JOIN loyalty_programs lp ON p.passenger_id = lp.passenger_id;`,
  vw_airport_traffic: `CREATE VIEW vw_airport_traffic AS
SELECT a.iata_code, COUNT(f.flight_id) AS flights_today
FROM airports a JOIN routes r ON a.airport_id = r.origin_id
JOIN flights f ON f.route_id = r.route_id
WHERE DATE(f.departure_time) = CURDATE()
GROUP BY a.iata_code;`,
  vw_daily_sales: `CREATE VIEW vw_daily_sales AS
SELECT DATE(payment_date) AS sale_date, SUM(amount) AS daily_total
FROM payments WHERE status='Completed'
GROUP BY DATE(payment_date);`,
  vw_crew_schedule: `CREATE VIEW vw_crew_schedule AS
SELECT f.flight_number, s.first_name, s.last_name, ca.position
FROM crew_assignments ca JOIN flights f ON ca.flight_id = f.flight_id
JOIN staff s ON ca.staff_id = s.staff_id;`,
  vw_flight_status_latest: `CREATE VIEW vw_flight_status_latest AS
SELECT f.flight_number, f.status, f.departure_time
FROM flights f WHERE f.departure_time >= NOW();`,
  vw_seat_availability: `CREATE VIEW vw_seat_availability AS
SELECT f.flight_number, fc.code AS fare_class, si.seats_total - si.seats_sold AS seats_available
FROM seat_inventory si JOIN flights f ON si.flight_id = f.flight_id
JOIN fare_classes fc ON si.fare_class_id = fc.fare_class_id;`,
  vw_booking_summary: `CREATE VIEW vw_booking_summary AS
SELECT b.booking_code, b.status, b.total_amount, COUNT(bp.passenger_id) AS pax_count
FROM bookings b JOIN booking_passengers bp ON b.booking_id = bp.booking_id
GROUP BY b.booking_id;`
};
