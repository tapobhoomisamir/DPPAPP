import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { CalendarComponent } from '../calendar/calendar.component'; // <-- Add this import
import { DayDetailsModalComponent } from '../day-details-modal/day-details-modal.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    CalendarComponent,
    DayDetailsModalComponent,
  ],
  declarations: [
    TabsPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class TabsPageModule {}
