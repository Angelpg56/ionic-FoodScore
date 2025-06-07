import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { HttpClient } from '@angular/common/http';
import { RestaurantsResponse } from '../interfaces/restaurants-response';
import { SingleRestaurantResponse } from '../interfaces/single-restaurant-response';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  #restaurantsURL = 'restaurants';
  #http = inject(HttpClient);

  getRestaurants(page?: number, search?: string): Observable<Restaurant[]> {
    let url = this.#restaurantsURL;
    if ((page !== undefined && page !== null) || (search !== undefined && search !== null && search !== '')) {
      const params = [];
      if (page !== undefined && page !== null) params.push(`page=${page}`);
      params.push(`search=${search ?? ''}`);
      url += `?${params.join('&')}`;
    }
    return this.#http
      .get<RestaurantsResponse>(url)
      .pipe(map((resp) => resp.restaurants));
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#restaurantsURL}/${id}`)
      .pipe(map((resp) => resp.restaurant));
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.#http
      .post<SingleRestaurantResponse>(this.#restaurantsURL, restaurant)
      .pipe(map((resp) => resp.restaurant));
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#restaurantsURL}/${id}`);
  }

  updateRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.#http
      .put<SingleRestaurantResponse>(`${this.#restaurantsURL}/${restaurant.id}`, restaurant)
      .pipe(map((resp) => resp.restaurant));
  }
}
