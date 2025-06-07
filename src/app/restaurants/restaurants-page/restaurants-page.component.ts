import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { RestaurantsService } from '../services/restaurants-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonSegment, IonSegmentButton, IonButton, IonText, IonNote, IonToolbar, IonButtons, IonLabel } from '@ionic/angular/standalone';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'restaurants-page',
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.scss'],
  standalone: true,
  imports: [
    RestaurantCardComponent, FormsModule, IonContent, IonGrid,
    IonRow, IonCol, IonSearchbar, IonSegment, IonSegmentButton,
    IonButton, IonText, IonNote, IonToolbar, IonLabel
  ]
})
export class RestaurantsPageComponent {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  restaurants = signal<Restaurant[]>([]);
  currentPage = 1;
  searchstr = '';
  showOpen = signal(false);

  constructor() {
    this.loadRestaurants(true);
  }

  loadRestaurants(reset = false) {
    this.#restaurantService
      .getRestaurants(this.currentPage, this.searchstr)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        catchError(error => {
          this.#router.navigate(['/auth/login']);
          return [];
        })
      )
      .subscribe(restaurants => {
        reset ? this.restaurants.set(restaurants)
              : this.restaurants.set([...this.restaurants(), ...restaurants]);
      });
  }

  search() {
    this.currentPage = 1;
    this.loadRestaurants(true);
  }

  loadMore() {
    this.currentPage++;
    this.loadRestaurants(false);
  }

  filteredRests = computed(() => {
    return this.restaurants().filter(r =>
      !this.showOpen() || this.isOpenToday(r.daysOpen)
    );
  });

  deleteRestaurant(id: number) {
    this.#restaurantService.deleteRestaurant(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.restaurants.set(this.restaurants().filter(r => r.id !== id));
      });
  }

  readonly days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  isOpenToday(daysOpen: string[]): boolean {
    const today = new Date().getDay();
    const days = (daysOpen || []).map(Number);
    return days.includes(today);
  }
}
