import { Component, DestroyRef, inject, input, numberAttribute, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RestaurantsService } from '../services/restaurants-service.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard.guard';
import { Restaurant } from '../interfaces/restaurant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, tap } from 'rxjs';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonCheckbox, IonButton, IonImg, IonNote, IonText, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.scss'],
  standalone: true,
  imports: [IonIcon, IonText,
    ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonCheckbox,
    IonButton, IonImg, IonNote
  ]
})
export class EditRestaurantComponent implements CanComponentDeactivate {
  id = input.required({ transform: numberAttribute });
  #restaurantsService = inject(RestaurantsService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #fb = inject(NonNullableFormBuilder);

  image = signal('');
  saved = false;
  restaurant = signal<Restaurant>({} as Restaurant);

  editRestaurantForm = this.#fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]],
    image: [''], // No requerido en edición
    cuisine: ['', [Validators.required]],
    description: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('([+0]?[0-9]{2} ?)?[0-9]{9}')]],
    daysOpen: this.#fb.array(
      new Array(7).fill(false).map(() => this.#fb.control(false)),
      { validators: [this.oneCheckedValidator] }
    )
  });

  readonly days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Cargar datos del restaurante
  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.#restaurantsService.getRestaurant(id).pipe(
      tap(restaurant => {
        this.restaurant.set(restaurant);
        this.image.set(restaurant.image);
        this.editRestaurantForm.patchValue({
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          description: restaurant.description,
          phone: restaurant.phone,
          daysOpen: this.days.map((_, i) =>
            (restaurant.daysOpen as unknown as string[]).includes(i.toString())
          )
        });
      }),
      catchError(() => {
        this.#router.navigate(['/restaurants']);
        return EMPTY;
      })
    )
  });

  updateRestaurant() {
    const formValue = this.editRestaurantForm.getRawValue();
    const updatedRestaurant: Restaurant = {
      ...this.restaurant(),
      ...formValue,
      image: this.image() || this.restaurant().image,
      daysOpen: formValue.daysOpen
        .map((isOpen, index) => isOpen ? index.toString() : null)
        .filter(day => day !== null) as string[]
    };

    this.#restaurantsService.updateRestaurant(updatedRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => console.error(err)
      });
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

  deleteRestaurant() {
    this.#restaurantsService.deleteRestaurant(this.id())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#router.navigate(['/restaurants']));
  }

  oneCheckedValidator(c: AbstractControl): ValidationErrors | null {
    return c.value.some((v: boolean) => v) ? null : { oneChecked: true };
  }

  canDeactivate() {
    return this.saved || this.editRestaurantForm.pristine ||
      confirm('¿Abandonar sin guardar cambios?');
  }
}
