import { Routes } from "@angular/router";
import { numericIdGuard } from "../shared/guards/numeric-id-guard.guard";
import { ProfileComponent } from "./profile/profile.component";
import { EditUserComponent } from "./edit-user/edit-user.component";

export const userRoutes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'edit', component: EditUserComponent },
  { path: ':id', canActivate: [numericIdGuard], component: ProfileComponent }
];
