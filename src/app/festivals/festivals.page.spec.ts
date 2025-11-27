import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FestivalsPage } from './festivals.page';

describe('Tab3Page', () => {
  let component: FestivalsPage;
  let fixture: ComponentFixture<FestivalsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FestivalsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FestivalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
