import { User } from "../../users/interfaces/user";

export interface Restaurant {
  id?: number;
  name: string;
  image: string;
  cuisine: string;
  description: string;
  phone: string;
  daysOpen: string[];
  address: string;
  lat: number;
  lng: number;
  creator?: User;
}
