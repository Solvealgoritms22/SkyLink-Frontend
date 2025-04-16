import { Component } from '@angular/core';
import { AvatarComponent } from '../../shared';
import { AuthService } from '../../core/services/auth.service';
import { LoadingPageComponent } from '../../shared/components/loading-page/loading-page.component';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [AvatarComponent, LoadingPageComponent],
    template: ` <div class="card">
        <div class="font-semibold text-xl mb-4">Empty Page</div>
        <app-avatar [imgUrl]="userWithImage.img" [username]="userWithImage.name" [email]="userWithImage.email" [avatarSize]="48" [textSize]="14"></app-avatar>
        <p>Use this page to start from scratch and place your custom content.</p>

        <button (click)="simulateLoading()">Simular Carga</button>

        <app-loading-page [loading]="isLoading" [message]="'Cargando datos...'"></app-loading-page>
    </div>`
})
export class Empty {
    isLoading: boolean = false;
    userWithImage = {
        name: '',
        email: '',
        img: ''
    };
    constructor(private authService: AuthService) {}

    ngOnInit() {
        // Llamamos a getUser() al iniciar
        this.authService
            .getUser()
            .then((user) => {
                // Ajusta según la estructura real que retorne tu `getUser()`.
                this.userWithImage = {
                    name: user.name,
                    email: user.email,
                    // si tu User no incluye un campo `img`, coloca uno por defecto
                    img: user.img || 'assets/profiles/default.png'
                };
            })
            .catch((err) => {
                console.error('Error al obtener usuario:', err);
                // Podrías mostrar un mensaje de error o fallback
            });
    }

    simulateLoading() {
        this.isLoading = true;
        // Simula una operación asíncrona de 3 seg.
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
    }
}
