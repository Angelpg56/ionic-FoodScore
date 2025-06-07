import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../../users/interfaces/user';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonNote, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonNote, IonButton, IonText
  ]
})
export class LoginComponent {
  #fb = inject(NonNullableFormBuilder);
  #userService = inject(AuthUsersService);
  #router = inject(Router);

  errorMsg = signal('');

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submitUser(): void {
    if (this.loginForm.valid) {
      const user: User = { ...this.loginForm.getRawValue() };
      this.errorMsg.set('');
      this.#userService.login(user).subscribe({
        next: () => this.#router.navigate(['/restaurants']),
        error: (error) => {
          this.errorMsg.set(error?.error?.message || 'Error en el login. Inténtalo de nuevo.');
        }
      });
    }
  }

  constructor() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
  }
}
