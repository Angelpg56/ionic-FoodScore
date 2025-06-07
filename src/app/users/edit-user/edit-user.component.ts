import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard.guard';
import { User } from '../interfaces/user';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAvatar, IonImg, IonItem, IonLabel, IonInput, IonNote, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonAvatar, IonImg, IonItem, IonLabel, IonInput, IonNote, IonButton, IonIcon
  ]
})
export class EditUserComponent implements CanComponentDeactivate {
  #userService = inject(UsersService);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  avatar?: string;
  saved = false;
  userOld?: User;
  editInfo = signal(false);
  editAvatar = signal(false);
  editPassword = signal(false);

  editUserForm = this.#fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    avatar: ['']
  });

  constructor() {
    addIcons({ camera });
    this.#userService.getUser().subscribe(user => {
      this.userOld = user;
      this.avatar = user.avatar;
      this.editUserForm.patchValue({
        name: user.name,
        email: user.email
      });
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => this.avatar = reader.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  updateUser() {
    const formValue = this.editUserForm.getRawValue();
    const userUpdated: User = {
      ...formValue,
      avatar: this.avatar || this.userOld?.avatar || '',
      password: formValue.password || ''
    };


    if (userUpdated.name !== this.userOld?.name || userUpdated.email !== this.userOld?.email) {
      this.#userService.updateUserData(userUpdated).subscribe(() => {
        this.editInfo.set(true);
        this.revisarEdit();
        console.log('User data updated successfully');
      });
    } else {
      this.editInfo.set(true);
      this.revisarEdit();
    }
    if (userUpdated.avatar && userUpdated.avatar !== this.userOld?.avatar) {
      this.#userService.updateUserAvatar(userUpdated.avatar).subscribe(() => {
        this.editAvatar.set(true);
        this.revisarEdit();
        console.log('User avatar updated successfully');
      });
    } else {
      this.editAvatar.set(true);
      this.revisarEdit();
    }
    if (userUpdated.password) {
      this.#userService.updateUserPassword(userUpdated.password).subscribe(() => {
        this.editPassword.set(true);
        this.revisarEdit();
        console.log('User password updated successfully');
      });
    } else {
      this.editPassword.set(true);
      this.revisarEdit();
    }
  }

  revisarEdit() {
      if (this.editInfo() && this.editAvatar() && this.editPassword()) {
        this.saved = true;
        this.#router.navigate(['/profile']);
      }
    };

  canDeactivate() {
    return this.saved || this.editUserForm.pristine ||
      confirm('¿Abandonar sin guardar cambios?');
  }
}
