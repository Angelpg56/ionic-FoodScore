import { Component, DestroyRef, effect, inject, numberAttribute, ResourceRef, signal } from '@angular/core';
import { RestaurantsService } from '../services/restaurants-service.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Restaurant } from '../interfaces/restaurant';
import { Router, RouterLink } from '@angular/router';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { IonContent, IonCard, IonFooter, IonToolbar, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';

@Component({
  selector: 'restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss'],
  standalone: true,
  imports: [IonSpinner, RestaurantCardComponent, IonContent,
    IonCard, IonFooter, IonToolbar, IonButton, RouterLink, OlMapDirective]
})
export class RestaurantDetailsComponent {
  id = signal<number | undefined>(undefined); // Usamos signal para id
  #restaurantService = inject(RestaurantsService);
  #title = inject(Title);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #userID: string | null = localStorage.getItem('userID');
  #route = inject(ActivatedRoute);
  routeId = this.#route.snapshot.paramMap.get('id') ?? undefined;
  loading = signal<boolean>(true);
  coordinates = signal<[number, number]>([-0.5, 38.5]);

  constructor() {
    const routeId = this.#route.snapshot.paramMap.get('id');
    if (routeId !== null && routeId !== undefined) {
      this.id.set(Number(routeId));
    }
  }

  restaurant = signal<Restaurant>({
    id: undefined,
    name: '',
    image: '',
    cuisine: '',
    description: '',
    phone: '',
    daysOpen: [],
    address: "Some street",
    lat: 39.2345235,
    lng: -1.4235,
  });

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => {
      return this.#restaurantService.getRestaurant(id).pipe(
        tap((restaurant: Restaurant) => {
          this.#title.setTitle(`${restaurant.name} | FoodScore`);
          this.restaurant.set({ ...restaurant });
          this.loading.set(false);
          this.coordinates.set([restaurant.lng, restaurant.lat]);
          console.log(restaurant);
        }),
        catchError(() => {
          this.loading.set(false);
          this.#router.navigate(['/restaurants']);
          return EMPTY;
        })
      );
    }
  });


  deleteRestaurant(id: number) {
    this.#restaurantService
      .deleteRestaurant(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#router.navigate(['/restaurants']));
  }

  isActualUser(): boolean {
    const creatorId = this.restaurant().creator?.id ?? this.restaurant().creator;
    return creatorId !== undefined && creatorId !== null && String(creatorId) === this.#userID;
  }
}
