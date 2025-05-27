/**
 * Modelo de datos para las definiciones de funciones SQL
 */
export const functionsScript = {
  fn_calculate_fare: `CREATE FUNCTION fn_calculate_fare(base DECIMAL(10,2), multiplier DECIMAL(3,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN base * multiplier;
END`,
  fn_distance_km: `CREATE FUNCTION fn_distance_km(lat1 DECIMAL(9,6), lon1 DECIMAL(9,6), lat2 DECIMAL(9,6), lon2 DECIMAL(9,6))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE r INT DEFAULT 6371;
    RETURN ROUND(r * ACOS(COS(RADIANS(lat1))*COS(RADIANS(lat2))*
           COS(RADIANS(lon2)-RADIANS(lon1)) + SIN(RADIANS(lat1))*SIN(RADIANS(lat2))));
END`,
  fn_flight_duration: `CREATE FUNCTION fn_flight_duration(dep DATETIME, arr DATETIME)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN TIMESTAMPDIFF(MINUTE, dep, arr);
END`,
  fn_available_seats: `CREATE FUNCTION fn_available_seats(flight INT, fare INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE sold INT;
    DECLARE total INT;
    SELECT seats_sold, seats_total INTO sold, total FROM seat_inventory
    WHERE flight_id = flight AND fare_class_id = fare;
    RETURN total - sold;
END`,
  fn_flight_occupancy: `CREATE FUNCTION fn_flight_occupancy(flight INT)
RETURNS DECIMAL(5,2)
READS SQL DATA
BEGIN
    DECLARE sold INT;
    DECLARE total INT;
    SELECT SUM(seats_sold), SUM(seats_total) INTO sold, total FROM seat_inventory
    WHERE flight_id = flight;
    RETURN (sold/total)*100;
END`,
  fn_format_currency: `CREATE FUNCTION fn_format_currency(amount DECIMAL(10,2))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    RETURN CONCAT('$', FORMAT(amount,2));
END`,
  fn_loyalty_tier: `CREATE FUNCTION fn_loyalty_tier(points INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    CASE
        WHEN points >= 75000 THEN RETURN 'Platinum';
        WHEN points >= 40000 THEN RETURN 'Gold';
        WHEN points >= 15000 THEN RETURN 'Silver';
        ELSE RETURN 'Bronze';
    END CASE;
END`,
  fn_flight_number_format: `CREATE FUNCTION fn_flight_number_format(airline CHAR(2), seq INT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    RETURN CONCAT(airline, LPAD(seq,4,'0'));
END`,
  fn_total_baggage_weight: `CREATE FUNCTION fn_total_baggage_weight(ticket INT)
RETURNS DECIMAL(7,2)
READS SQL DATA
BEGIN
    DECLARE w DECIMAL(7,2);
    SELECT SUM(weight_kg) INTO w FROM baggage WHERE ticket_id = ticket;
    RETURN IFNULL(w,0);
END`,
  fn_seats_by_class: `CREATE FUNCTION fn_seats_by_class(flight INT, fclass INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT seats_total INTO total FROM seat_inventory
    WHERE flight_id = flight AND fare_class_id = fclass;
    RETURN total;
END`
};
