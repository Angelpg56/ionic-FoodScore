import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page-guard.guard";
import { numericIdGuard } from "../shared/guards/numeric-id-guard.guard";
import { RestaurantDetailsComponent } from "./restaurant-details/restaurant-details.component";
import { RestaurantFormComponent } from "./restaurant-form/restaurant-form.component";
import { RestaurantsPageComponent } from "./restaurants-page/restaurants-page.component";
import { EditRestaurantComponent } from "./edit-restaurant/edit-restaurant.component";

export const restaurantRoutes: Routes = [
  {
    path: '',
    component: RestaurantsPageComponent,
    title: 'Inicio | FoodScore'
  },
  {
    path: 'add',
    canDeactivate: [leavePageGuard],
    component: RestaurantFormComponent,
    title: 'Añadir Restaurante | FoodScore'
  },
  {
    path: 'edit/:id',
    canActivate: [numericIdGuard],
    component:  EditRestaurantComponent
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    component:  RestaurantDetailsComponent
  }
]
