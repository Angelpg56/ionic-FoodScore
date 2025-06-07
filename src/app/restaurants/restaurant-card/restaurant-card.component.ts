import { Component, computed, inject, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { UsersService } from '../../users/services/users.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { Router, RouterLinkActive } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonChip, IonLabel, IonText, IonFooter, IonButton, IonIcon, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
  standalone: true,
  imports: [IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonImg, IonChip, IonLabel, IonText, IonFooter, IonButton, IonIcon,
    RouterLink, RouterLinkActive
  ]
})
export class RestaurantCardComponent {
  #router = inject(Router);
  #userService = inject(UsersService);
  #userID = localStorage.getItem('userID');

  restaurant = input.required<Restaurant>();
  delete = output<number>();

  // Iconos
  constructor() {
    addIcons({ trash });
  }

  // Cargar datos del creador
  userResource = rxResource({
    request: () => this.restaurant(),
    loader: ({ request: restaurant }) =>
      this.#userService.getUser(Number(restaurant.creator) || restaurant.creator?.id).pipe(
        catchError(() => {
          this.#router.navigate(['/login']);
          return EMPTY;
        })
      ),
  });

  user = computed(() => this.userResource.value());

  // Navegación
  navigateToDetails() {
    const id = this.restaurant().id;
    if (id !== undefined && id !== null) {
      this.#router.navigate(['/restaurants', id]);
    }
  }

  navigateToUserProfile() {
    const creatorId = this.restaurant().creator?.id ?? this.restaurant().creator;
    if (creatorId) this.#router.navigate(['/profile', creatorId]);
  }

  // Lógica de días
  readonly days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  getDaysFormatted(): string {
    return (this.restaurant().daysOpen as unknown as number[])
      .map(d => this.days[d])
      .join(', ');
  }

  isOpenToday(): boolean {
    // El backend puede devolver daysOpen como string[] o number[]
    // Convertimos a number[] para comparar correctamente
    const daysOpen = (this.restaurant().daysOpen as any[]).map(Number);
    const today = new Date().getDay();
    return daysOpen.includes(today);
  }

  isActualUser(): boolean {
    const creatorId = this.restaurant().creator?.id ?? this.restaurant().creator;
    return creatorId !== undefined && creatorId !== null && String(creatorId) === this.#userID;
  }
}
