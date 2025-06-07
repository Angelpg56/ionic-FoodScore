import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonGrid, IonButton, IonIcon, IonList, IonItem, IonListHeader, IonAvatar, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ CommonModule, FormsModule, IonAvatar, IonListHeader, IonItem, IonList, IonIcon, IonButton, IonGrid, IonCol, IonRow, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  data = {
    name: 'Angel',
    email: 'angel@prueba.com',
    description: 'Seccion de prueba de la descripcion',
    password: ''
  };

  showPass = false;

  constructor() {}
}
