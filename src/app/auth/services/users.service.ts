import { inject, Injectable, signal, WritableSignal } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Register } from '../interfaces/register';
import { Login } from '../interfaces/login';
import { User } from '../../users/interfaces/user';
import { UsersService } from '../../users/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUsersService {
  //#cookieService = inject(CookieService);
  #authURL = 'auth';
  #http = inject(HttpClient);
  #userService = inject(UsersService);
  #logged: WritableSignal<boolean> = signal(false);

  login(user: User): Observable<void> {
    this.logout();

    //console.log(`${this.#authURL}/login ${user.email} ${user.password}`);
    return this.#http
      .post<Login>(`${this.#authURL}/login`, {'email': user.email, 'password': user.password})
      .pipe(map(r => {
        //console.log(r.accessToken);
        localStorage.setItem('token', r.accessToken);
        this.#userService.getUser(undefined).subscribe((user) => {
          //console.log(user);
          if (user.id !== undefined && user.id !== null) {
            localStorage.setItem('userID', user.id.toString());
            this.#logged.set(true);
          }
        });
        //console.log('Token: ', localStorage.getItem('token'));
        //this.#cookieService.set('token', r.accessToken, 365, '/');
        //this.#logged.set(true);
      }));
  }

  register(user: User): Observable<Register> {
    return this.#http
      .post<Register>(`${this.#authURL}/register`, user)
      .pipe(map((resp) => resp));
  }

  validateToken(): Observable<boolean> {
    return this.#http
      .get<boolean>(`${this.#authURL}/validate`)
      .pipe(map((resp) => resp));
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('userID'); // Elimina el ID del usuario
    localStorage.removeItem('token'); // Elimina el token
    this.#logged.set(false); // Marca como no logueado
  }
}
