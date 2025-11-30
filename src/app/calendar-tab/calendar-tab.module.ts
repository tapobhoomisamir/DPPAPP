import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarPage } from './calendar-tab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './calendar-tab-routing.module';
import { CalendarComponent } from '../calendar/calendar.component';
import { DayDetailsModalComponent } from '../day-details-modal/day-details-modal.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    CalendarComponent,
    DayDetailsModalComponent
  ],
  declarations: [CalendarPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class CalendarPageModule {}
