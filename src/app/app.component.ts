import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { IonMenu, IonList, IonItem, IonLabel, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
    IonMenu, IonList, IonItem, IonLabel, IonMenuButton
  ]
})
export class AppComponent {
  #router = inject(Router);

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.#router.navigate(['/auth/login']);
  }
}
