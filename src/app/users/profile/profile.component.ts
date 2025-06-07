import { Component, computed, inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { catchError, EMPTY, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonImg, IonText, IonList, IonItem, IonLabel, IonFooter, IonToolbar, IonButtons, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonAvatar, IonImg, IonText, IonList, IonItem, IonLabel,
    IonFooter, IonToolbar, IonButtons, IonButton
  ]
})
export class ProfileComponent {
  #userService = inject(UsersService);
  #userID = localStorage.getItem('userID');
  #title = inject(Title);
  #route = inject(ActivatedRoute);

  id = computed(() => {
    const param = this.#route.snapshot.paramMap.get('id');
    if (param) {
      return Number(param);
    }
    // Si no hay id en la ruta, usar el userID del localStorage
    return this.#userID ? Number(this.#userID) : undefined;
  });

  userResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.#userService.getUser(id).pipe(
      tap((user) => this.#title.setTitle(`${user.name} Profile | FoodScore`)),
      catchError(() => EMPTY)
    ),
  });

  user = computed(() => this.userResource.value());
  isActualUser = computed(() => {
    const id = this.id();
    return this.user() && (Number(this.#userID) === id || id === undefined || isNaN(Number(id)));
  });
}
