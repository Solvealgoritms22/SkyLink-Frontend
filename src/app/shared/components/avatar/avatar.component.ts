import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton'; // Nuevo módulo

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [
        CommonModule,
        ProgressSpinnerModule, // Puede quedarse si usas spinner en otros componentes
        SkeletonModule // Importamos el módulo de skeleton
    ],
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
    /**
     * URL de la imagen a mostrar
     */
    @Input() imgUrl?: string;

    /**
     * Nombre de usuario o cualquier texto a mostrar.
     * Se usará también para generar iniciales si falla la imagen.
     */
    @Input() username: string = '';

    /**
     * Email (opcional). Se mostrará debajo del nombre de usuario.
     */
    @Input() email: string = '';

    /**
     * Role (opcional). Se mostrará debajo del nombre de usuario.
     */
    @Input() role: string = ''

    /**
     * Tamaño en píxeles del círculo (imagen o iniciales).
     * Por defecto: 48px
     */
    @Input() avatarSize: number = 48;

    /**
     * Tamaño en píxeles de la fuente para el texto (nombre y email).
     * Por defecto: 14px (o el que quieras)
     */
    @Input() textSize: number = 14;

    /**
     * true => la imagen se cargó con éxito
     * false => seguimos cargando o hubo error
     */
    imageLoaded = false;

    /**
     * true => la imagen falló al cargar
     */
    error = false;

    /**
     * Llamado cuando la imagen termina de cargar
     */
    onImageLoad(): void {
        this.imageLoaded = true;
        this.error = false;
    }

    /**
     * Llamado cuando la imagen falla
     */
    onImageError(): void {
        this.error = true;
        this.imageLoaded = false;
    }

    /**
     * Retorna las iniciales en mayúsculas, por ejemplo 'John Doe' => 'JD'
     */
    get initials(): string {
        if (!this.username?.trim()) return '?';

        const words = this.username.trim().split(/\s+/);
        const firstInitial = words[0]?.charAt(0).toUpperCase() || '';
        const secondInitial = words.length > 1 ? words[1].charAt(0).toUpperCase() : '';

        return firstInitial + secondInitial;
    }
}

/*   
EJEMPLO DE USO:

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from 'src/app/shared/components/avatar/avatar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <h2>Dashboard</h2>

    <!-- Con imagen válida -->
    <app-avatar 
      [imgUrl]="userWithImage.img" 
      [username]="userWithImage.name"
      [email]="userWithImage.email"
    ></app-avatar>

  `
})
export class DashboardComponent {
  userWithImage = {
    name: 'Alice Wonder',
    email: 'alice@test.com',
    img: 'assets/profiles/alice.png'
  };


*/
