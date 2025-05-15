import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /* ---------------- estado reactivo ---------------- */
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable(); // ←  suscríbete desde el topbar

    private _isLoggedIn = false;
    private tokenKey = 'app_token';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        const token = localStorage.getItem(this.tokenKey);
        this._isLoggedIn = !!token;

        /* Si había token, intenta poblar el usuario (silencioso) */
        if (this._isLoggedIn) {
            this.getUser()
                .then((u) => this.userSubject.next(u))
                .catch(() => {
                    /* token inválido → lo descartamos */
                    localStorage.removeItem(this.tokenKey);
                    this._isLoggedIn = false;
                });
        }
    }

    /* ------------- getters ------------ */
    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }
    get token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /* ------------- LOGIN -------------- */
    login(email: string, password: string): Promise<boolean> {
        return environment.mockLogin ? this.mockLogin(email, password) : this.realLogin(email, password);
    }

    /* ------------- LOGOUT ------------- */
    logout(): void {
        this._isLoggedIn = false;
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null); // 🔔 emite null
        this.router.navigate(['/auth/login']);
    }

    /**
     * Login de prueba (Mock)
     */
    /* ===== MOCK LOGIN ===== */
    private mockLogin(email: string, password: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (email === 'skylink@gmail.com' && password === '123456') {
                this._isLoggedIn = true;
                localStorage.setItem(this.tokenKey, this.generateMockJwt(email));

                /* obtenemos datos simulados y los emitimos */
                const user = await this.mockGetUser();
                this.userSubject.next(user); // 🔔 emite usuario
                resolve(true);
            } else {
                reject(false);
            }
        });
    }

    /**
     * Genera un JWT de mentira con el mismo formato de un JWT real
     * (header.payload.signature), usando Base64 URL safe.
     */
    private generateMockJwt(email: string): string {
        // Cabecera simulada
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Payload con datos falsos
        const payload = {
            sub: email,
            iat: Math.floor(Date.now() / 1000), // Fecha de emisión
            exp: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
        };

        // Convertir a Base64 “URL friendly” (sin +, / ni =)
        const encodedHeader = this.toBase64Url(header);
        const encodedPayload = this.toBase64Url(payload);

        // Firma ficticia
        const fakeSignature = 'fakeSignature61a661';

        return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
    }

    /**
     * Helper que codifica un objeto JSON en Base64Url (usado en JWT).
     */
    private toBase64Url(obj: any): string {
        const jsonStr = JSON.stringify(obj);
        // btoa -> base64. Reemplazamos caracteres para hacerlo “URL safe”,
        // y quitamos padding '=' si hubiera.
        return btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    /**
     * Login real usando una API
     */
    /* ===== REAL LOGIN ===== */
    private realLogin(email: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
                next: async (resp) => {
                    if (resp?.token) {
                        this._isLoggedIn = true;
                        localStorage.setItem(this.tokenKey, resp.token);

                        /* pide el perfil real y emítelo */
                        const user = await this.realGetUser();
                        this.userSubject.next(user); // 🔔 emite usuario
                        resolve(true);
                    } else {
                        reject(false);
                    }
                },
                error: () => reject(false)
            });
        });
    }

    // ----------------------------------
    // NUEVO: MÉTODO getUser()
    // ----------------------------------
    /**
     * Retorna la información del usuario actual.
     * Si mockLogin === true, obtenemos datos simulados.
     * Si no, hacemos un request real a la API.
     */
    async getUser(): Promise<User> {
        if (environment.mockLogin) {
            return this.mockGetUser();
        } else {
            return this.realGetUser();
        }
    }

    /**
     * Versión mock de getUser
     * (por ejemplo, decodificar token falso o retornar datos fijos)
     */
    private async mockGetUser(): Promise<User> {
        // Opción A) Decodificar el token simulado
        // Ejemplo: parsear el payload del JWT falso
        const token = this.token;
        if (!token) {
            throw new Error('No token found.');
        }

        // El JWT simulado está en formato header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format.');
        }

        try {
            // El payload está en parts[1]
            const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(payloadJson);

            // Podrías extraer email, roles, etc. de la payload
            // y retornar un objeto con la estructura de tu User
            return {
                id: 1,
                img: 'images/profiles/testuser.png',
                name: 'Darling',
                lastname: 'Fajardo',
                email: payload.sub,
                nacionalidad: 'Rep. Dominicana',
                genero: 'Masculino',
                fechaNacimiento: '1998-08-18',
                phone: '+1(809) 401-7444',
                role: 'user'
            };
        } catch (error) {
            // Si algo falla en la decodificación, puedes retornar un mock fijo
            return {
                id: 1,
                img: 'images/profiles/testuser.png',
                name: 'Fail',
                lastname: 'Decode',
                email: 'darlingf1998@gmail.com',
                nacionalidad: 'Rep. Dominicana',
                genero: 'Masculino',
                fechaNacimiento: '1998-08-18',
                phone: '+1(809) 401-7444',
                role: 'user'
            };
        }
    }

    /**
     * Versión real de getUser
     * (llamada a la API, ejemplo: GET /auth/user)
     */
    private async realGetUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.http.get<User>(`${environment.apiUrl}/auth/user`).subscribe({
                next: (resp) => resolve(resp),
                error: (err) => reject(err)
            });
        });
    }
}
