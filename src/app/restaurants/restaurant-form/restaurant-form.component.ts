import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RestaurantsService } from '../services/restaurants-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard.guard';
import { Restaurant } from '../interfaces/restaurant';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonCheckbox, IonButton, IonImg, IonNote, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { image } from 'ionicons/icons';

@Component({
  selector: 'restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
  standalone: true,
  imports: [IonText,
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonCheckbox,
    IonButton, IonImg, IonNote, IonIcon
  ]
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);

  image = signal('');
  saved = false;

  restaurantForm = this.#fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]],
    image: ['', [Validators.required]],
    cuisine: ['', [Validators.required]],
    description: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('([+0]?[0-9]{2} ?)?[0-9]{9}')]],
    daysOpen: this.#fb.array(
      new Array(7).fill(false).map(() => this.#fb.control(false)),
      { validators: [this.oneCheckedValidator] }
    )
  });

  readonly days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor() {
    addIcons({ image });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => this.image.set(reader.result as string);
      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFileInput() {
    document.getElementById('image')?.click();
  }

  submitRestaurant() {
    const formValue = this.restaurantForm.getRawValue();
    const restaurant: Restaurant = {
      ...formValue,
      image: this.image(),
      daysOpen: formValue.daysOpen
        .map((isOpen, index) => isOpen ? index.toString() : null)
        .filter(day => day !== null) as string[],
      address: "Dirección por defecto",
      lat: 39.4699,
      lng: -0.3763
    };

    this.#restaurantService.addRestaurant(restaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (r) => {
          this.saved = true;
          this.#router.navigate(['/restaurants', r.id]);
        },
        error: (err) => console.error(err)
      });
  }

  oneCheckedValidator(c: AbstractControl): ValidationErrors | null {
    return c.value.some((v: boolean) => v) ? null : { oneChecked: true };
  }

  canDeactivate() {
    return this.saved || this.restaurantForm.pristine ||
      confirm('¿Abandonar sin guardar cambios?');
  }
}
