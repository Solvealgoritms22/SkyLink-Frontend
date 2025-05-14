import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';
import { RegisterUiOnly } from './register';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'register', component: RegisterUiOnly },
    { path: 'login', canActivate: [NoAuthGuard] , component: Login }
] as Routes;
