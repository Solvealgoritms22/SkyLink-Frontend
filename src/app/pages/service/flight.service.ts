import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flight {
    id: number;
    airline: string;
    origin: string;
    destination: string;
    date: string;           // Fecha de ida
    returnDate?: string;    // Fecha de vuelta, opcional (solo para "Ida y vuelta")
    time: string;
    seats: number;
    price: number;
    flightClass: string;    // "Económica" o "Enterprise"
    banner?: string;
    iata?: string;
    logo?: string;
    color?: string;
}
  
@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.baseUrl}/flights`);
  }
}
