import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Flight {
    id: number;
    airline: string;
    origin: string;
    destination: string;
    date: string; // Fecha de ida
    returnDate?: string; // Fecha de vuelta, opcional (solo para "Ida y vuelta")
    time: string;
    seats: number;
    price: number;
    flightClass: string; // "Económica" o "Enterprise"
    banner?: string;
    iata?: string;
    logo?: string;
    color?: string;
}

@Injectable({ providedIn: 'root' })
export class FlightService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    // Conjunto de datos dummy
    private dummyFlights: Flight[] = [
        {
            id: 3,
            airline: 'Arajet',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Newark – Liberty International (EWR)',
            date: '2025-06-05',
            time: '07:00',
            seats: 24,
            price: 136,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            returnDate: '2025-06-12',
            flightClass: 'Económica'
        },
        {
            id: 4,
            airline: 'Dominicana',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Miami – International Airport (MIA)',
            date: '2025-06-06',
            time: '09:30',
            seats: 15,
            price: 189,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Enterprise'
        },
        {
            id: 5,
            airline: 'Air Century',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Panamá – Tocumen International (PTY)',
            date: '2025-06-07',
            time: '13:45',
            seats: 10,
            price: 210,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            returnDate: '2025-06-14',
            flightClass: 'Económica'
        },
        {
            id: 6,
            airline: 'Arajet',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Toronto – Pearson International (YYZ)',
            date: '2025-06-08',
            time: '06:20',
            seats: 18,
            price: 275,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Enterprise'
        },
        {
            id: 7,
            airline: 'Red Air',
            origin: 'Santo Domingo – La Isabela (JBQ)',
            destination: 'Caracas – Simón Bolívar International (CCS)',
            date: '2025-06-09',
            time: '11:15',
            seats: 20,
            price: 145,
            color: '#BB133E',
            banner: 'assets/banners/red-air.png',
            logo: 'assets/icons/redair_ico.png',
            returnDate: '2025-06-16',
            flightClass: 'Económica'
        },
        {
            id: 8,
            airline: 'American Airlines',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-10',
            time: '17:40',
            seats: 30,
            price: 495,
            color: '#012169',
            banner: 'assets/banners/american-airlines.png',
            logo: 'assets/icons/favicon.png',
            flightClass: 'Enterprise'
        },
        // Adiciones sin aerolíneas nuevas (id 9–32)
        {
            id: 9,
            airline: 'Dominicana',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Miami – International Airport (MIA)',
            date: '2025-06-11',
            time: '08:00',
            seats: 22,
            price: 199,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            returnDate: '2025-06-18',
            flightClass: 'Económica'
        },
        {
            id: 10,
            airline: 'Air Century',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-12',
            time: '10:30',
            seats: 12,
            price: 415,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            returnDate: '2025-06-19',
            flightClass: 'Enterprise'
        },
        {
            id: 11,
            airline: 'Arajet',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Toronto – Pearson International (YYZ)',
            date: '2025-06-13',
            time: '12:15',
            seats: 20,
            price: 155,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Económica'
        },
        {
            id: 12,
            airline: 'Red Air',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Newark – Liberty International (EWR)',
            date: '2025-06-14',
            time: '14:45',
            seats: 16,
            price: 165,
            color: '#BB133E',
            banner: 'assets/banners/red-air.png',
            logo: 'assets/icons/redair_ico.png',
            flightClass: 'Económica'
        },
        {
            id: 13,
            airline: 'American Airlines',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-15',
            time: '16:20',
            seats: 28,
            price: 520,
            color: '#012169',
            banner: 'assets/banners/american-airlines.png',
            logo: 'assets/icons/favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 14,
            airline: 'Dominicana',
            origin: 'Santo Domingo – La Isabela (JBQ)',
            destination: 'Panamá – Tocumen International (PTY)',
            date: '2025-06-16',
            time: '18:00',
            seats: 14,
            price: 175,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Económica'
        },
        {
            id: 15,
            airline: 'Air Century',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Caracas – Simón Bolívar International (CCS)',
            date: '2025-06-17',
            time: '20:10',
            seats: 18,
            price: 225,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 16,
            airline: 'Arajet',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-18',
            time: '22:30',
            seats: 22,
            price: 150,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Económica'
        },
        {
            id: 17,
            airline: 'Red Air',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Miami – International Airport (MIA)',
            date: '2025-06-19',
            time: '08:00',
            seats: 20,
            price: 155,
            color: '#BB133E',
            banner: 'assets/banners/red-air.png',
            logo: 'assets/icons/redair_ico.png',
            flightClass: 'Económica'
        },
        {
            id: 18,
            airline: 'American Airlines',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Toronto – Pearson International (YYZ)',
            date: '2025-06-20',
            time: '10:30',
            seats: 30,
            price: 505,
            color: '#012169',
            banner: 'assets/banners/american-airlines.png',
            logo: 'assets/icons/favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 19,
            airline: 'Dominicana',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Newark – Liberty International (EWR)',
            date: '2025-06-21',
            time: '12:15',
            seats: 15,
            price: 179,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Económica'
        },
        {
            id: 20,
            airline: 'Air Century',
            origin: 'Santo Domingo – La Isabela (JBQ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-22',
            time: '14:45',
            seats: 11,
            price: 430,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 21,
            airline: 'Arajet',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Caracas – Simón Bolívar International (CCS)',
            date: '2025-06-23',
            time: '16:20',
            seats: 18,
            price: 142,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Económica'
        },
        {
            id: 22,
            airline: 'Red Air',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Panamá – Tocumen International (PTY)',
            date: '2025-06-24',
            time: '18:00',
            seats: 20,
            price: 149,
            color: '#BB133E',
            banner: 'assets/banners/red-air.png',
            logo: 'assets/icons/redair_ico.png',
            flightClass: 'Económica'
        },
        {
            id: 23,
            airline: 'American Airlines',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-25',
            time: '20:10',
            seats: 30,
            price: 515,
            color: '#012169',
            banner: 'assets/banners/american-airlines.png',
            logo: 'assets/icons/favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 24,
            airline: 'Dominicana',
            origin: 'Santo Domingo – La Isabela (JBQ)',
            destination: 'Toronto – Pearson International (YYZ)',
            date: '2025-06-26',
            time: '22:30',
            seats: 17,
            price: 182,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Económica'
        },
        {
            id: 25,
            airline: 'Air Century',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Caracas – Simón Bolívar International (CCS)',
            date: '2025-06-27',
            time: '08:00',
            seats: 10,
            price: 220,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            flightClass: 'Económica'
        },
        {
            id: 26,
            airline: 'Arajet',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-06-28',
            time: '10:30',
            seats: 21,
            price: 160,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Enterprise'
        },
        {
            id: 27,
            airline: 'Red Air',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Newark – Liberty International (EWR)',
            date: '2025-06-29',
            time: '12:15',
            seats: 19,
            price: 150,
            color: '#BB133E',
            banner: 'assets/banners/red-air.png',
            logo: 'assets/icons/redair_ico.png',
            flightClass: 'Económica'
        },
        {
            id: 28,
            airline: 'American Airlines',
            origin: 'Santo Domingo – La Isabela (JBQ)',
            destination: 'Panamá – Tocumen International (PTY)',
            date: '2025-06-30',
            time: '14:45',
            seats: 30,
            price: 505,
            color: '#012169',
            banner: 'assets/banners/american-airlines.png',
            logo: 'assets/icons/favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 29,
            airline: 'Dominicana',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Toronto – Pearson International (YYZ)',
            date: '2025-07-01',
            time: '16:20',
            seats: 15,
            price: 185,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Económica'
        },
        {
            id: 30,
            airline: 'Air Century',
            origin: 'Punta Cana – International Airport (PUJ)',
            destination: 'Madrid – Adolfo Suárez Barajas (MAD)',
            date: '2025-07-02',
            time: '18:00',
            seats: 12,
            price: 430,
            color: '#E30613',
            banner: 'assets/banners/Air-Century.png',
            logo: 'assets/icons/air-century-favicon.png',
            flightClass: 'Enterprise'
        },
        {
            id: 31,
            airline: 'Arajet',
            origin: 'Santiago de los Caballeros – Cibao (STI)',
            destination: 'Caracas – Simón Bolívar International (CCS)',
            date: '2025-07-03',
            time: '20:10',
            seats: 17,
            price: 142,
            color: '#6B2CA0',
            banner: 'assets/banners/aranjet.png',
            logo: 'https://images.prismic.io/arajet-ezycommerce/d48ee2f6-69ae-4c87-a0e4-85cb2dc0bc2f_ISOTYPE.png',
            flightClass: 'Económica'
        },
        {
            id: 32,
            airline: 'Dominicana',
            origin: 'Santo Domingo – Las Américas (SDQ)',
            destination: 'Newark – Liberty International (EWR)',
            date: '2025-07-04',
            time: '22:30',
            seats: 23,
            price: 195,
            color: '#0F4C81',
            banner: 'assets/banners/sky.png',
            logo: 'https://skyhighdo.com/wp-content/uploads/2025/04/skyhighdo-favicon-2025-150x150.png',
            flightClass: 'Económica'
        }
    ];

    getFlights(): Observable<Flight[]> {
        return this.http.get<Flight[]>(`${this.baseUrl}/flights`).pipe(
            catchError((error) => {
                console.log('Error al obtener los vuelos del backend:', error);
                // Retornar los datos dummy si falla la llamada al backend
                return of(this.dummyFlights);
            })
        );
    }
}
