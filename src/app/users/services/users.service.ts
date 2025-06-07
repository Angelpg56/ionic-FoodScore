import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, map, Observable } from 'rxjs';
import { UserResponse } from '../interfaces/user-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #usersURL = 'users';
  #http = inject(HttpClient);

  getUser(id?: number): Observable<User> {
    //console.log(`Fetching user with ID: ${id == null || isNaN(id) ? 'me' : id}`);
    return this.#http
      .get<UserResponse>(`${this.#usersURL}/${id == null || isNaN(id) ? 'me' : id}`)
      .pipe(map((resp) => resp.user));
  }

  updateUserData(userNew: User): Observable<boolean> {
    return this.#http.put(`${this.#usersURL}/me`, { name: userNew.name, email: userNew.email })
      .pipe(map(() => true), catchError(() => [false]));
  }

  updateUserAvatar(avatar: string): Observable<boolean> {
    return this.#http.put(`${this.#usersURL}/me/avatar`, { avatar })
      .pipe(map(() => true), catchError(() => [false]));
  }

  updateUserPassword(password: string): Observable<boolean> {
    return this.#http.put(`${this.#usersURL}/me/password`, { password })
      .pipe(map(() => true), catchError(() => [false]));
  }
}
