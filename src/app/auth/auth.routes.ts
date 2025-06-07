import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

export const restaurantRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | FoodScore'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register | FoodScore'
  },
  {
    path: '**',
    component: LoginComponent,
    title: 'Login | FoodScore'
  }
]
