import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  private tokenKey = 'app_token';

  constructor(private http: HttpClient, private router: Router) {
    // Al iniciar, revisamos si ya existe un token en localStorage
    const token = localStorage.getItem(this.tokenKey);
    this._isLoggedIn = !!token;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Promise<boolean> {
    if (environment.mockLogin) {
      return this.mockLogin(email, password);
    } else {
      return this.realLogin(email, password);
    }
  }

  logout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Login de prueba (Mock)
   */
  private mockLogin(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Credenciales de prueba
      const mockEmail = 'skylink@gmail.com';
      const mockPassword = '123456';

      if (email === mockEmail && password === mockPassword) {
        this._isLoggedIn = true;
        // Generar un JWT “falso” con data mock
        const mockToken = this.generateMockJwt(email);
        // Guardar en localStorage
        localStorage.setItem(this.tokenKey, mockToken);
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
      iat: Math.floor(Date.now() / 1000),       // Fecha de emisión
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
    return btoa(jsonStr)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Login real usando una API
   */
  private realLogin(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
        next: (resp) => {
          // Asumiendo que la respuesta contiene un token JWT, por ejemplo
          if (resp && resp.token) {
            this._isLoggedIn = true;
            localStorage.setItem(this.tokenKey, resp.token);
            resolve(true);
          } else {
            reject(false);
          }
        },
        error: () => {
          reject(false);
        }
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
