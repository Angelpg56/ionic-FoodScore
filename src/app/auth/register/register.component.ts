import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthUsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { User } from '../../users/interfaces/user';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonNote, IonButton, IonText, IonIcon, IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonNote, IonButton, IonText, IonIcon, IonImg
  ]
})
export class RegisterComponent {
  #fb = inject(NonNullableFormBuilder);
  #userService = inject(AuthUsersService);
  #router = inject(Router);

  registerForm = this.#fb.group({
    name: ['', [Validators.required]],
    emailGroup: this.#fb.group({
      email: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.email]],
    }, { validators: matchEmail }),
    password: ['', [Validators.required, Validators.minLength(4)]],
    avatar: ['', [Validators.required]],
  });

  image = signal<string>('');
  errorMsg = signal('');

  constructor() {
    addIcons({ arrowBack }); // Añade el icono de "volver"
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => this.image.set(reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  submitUser(): void {
    if (this.registerForm.valid) {
      const user: User = {
        name: this.registerForm.get('name')?.value || '',
        email: this.registerForm.get('emailGroup.email')?.value || '',
        password: this.registerForm.get('password')?.value || '',
        avatar: this.image() || '',
      };
      this.errorMsg.set('');
      this.#userService.register(user).subscribe({
        next: () => this.#router.navigate(['/auth/login']),
        error: (error) => {
          this.errorMsg.set(error?.error?.message || 'Error en el registro. Inténtalo de nuevo.');
        }
      });
    }
  }
}

// Validador personalizado para emails coincidentes
export function matchEmail(c: AbstractControl): ValidationErrors | null {
  const email = (c as FormGroup).get('email')?.value;
  const email2 = (c as FormGroup).get('email2')?.value;
  return email && email2 && email === email2 ? null : { matchEmail: true };
}
