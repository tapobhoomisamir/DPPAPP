import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-day-details-modal',
  templateUrl: './day-details-modal.component.html',
  styleUrls: ['./day-details-modal.component.scss'],
  standalone: true,   // <-- add this
  imports: [
    CommonModule,     // <-- fixes *ngIf, *ngFor
    IonicModule       // <-- fixes ion-button, ion-item, ion-icon
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DayDetailsModalComponent {

  @Input() date: any;
  @Input() fullData: any;

  constructor(
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  openFestival(id: number) {
    this.close();
    this.router.navigate(['https://test/festival-details', id]);
  }
}
