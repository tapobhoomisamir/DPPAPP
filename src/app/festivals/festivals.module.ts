import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FestivalsPage } from './festivals.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FestivalsPageRoutingModule } from './festivals-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FestivalsPageRoutingModule
  ],
  declarations: [FestivalsPage]
})
export class FestivalsModule {}
