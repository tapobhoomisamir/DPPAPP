import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ModalController } from '@ionic/angular';
import { DayDetailsModalComponent } from '../day-details-modal/day-details-modal.component';
import { NgZone } from '@angular/core';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { ApiService } from '../api-service';
import { ChangeDetectorRef } from '@angular/core';

export interface DayPanchang {
  day: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  tithi?: string;
  panchang?: string;
  dayRating?: string;
  festival?: string;
  [key: string]: any; // optional if extra fields exist
}


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  month: number;
  year: number;
    days: { date?: number; label?: string; badge?: boolean; highlight?: boolean }[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weeks: { date?: number; label?: string; badge?: boolean; highlight?: boolean }[][] = [];


   // Event data for the month
  events = [
    { date: 1, label: 'Pratipada' },
    { date: 2, label: 'Dwitiya' },
    { date: 3, label: 'Tritiya' },
    { date: 4, label: 'Chaturthi', highlight: true },
    { date: 7, label: 'Karwa Chauth', badge: true },
    { date: 12, label: 'Dhanteras', badge: true },
    { date: 14, label: 'Diwali', badge: true },
    { date: 15, label: 'Govardhan Puja', badge: true },
    // add all other days...
  ];

  monthData: DayPanchang[] = [];

  
  @ViewChild('calendarContainer', { static: true }) calendarContainer!: ElementRef;



  constructor(private gestureCtrl: GestureController,
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private api: ApiService,
    private cdr: ChangeDetectorRef) {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.generateCalendar(this.month, this.year);
  }

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.calendarContainer.nativeElement,
      threshold: 20,  // small swipe threshold for mobile
      gestureName: 'swipe-calendar',

      onEnd: ev => {
        if (ev.deltaX > 80) {
          this.ngZone.run(() => {
            this.animateSwipe('right');
            this.prevMonth();   // swipe right → previous month
          });
        } else if (ev.deltaX < -80) {
          this.ngZone.run(() => {
            this.animateSwipe('left'); 
            this.nextMonth();   // swipe left → next month
          });
        }
      }
    });

    gesture.enable(true);
  }


  generateCalendar(month: number, year: number) {
    this.days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Add blank days for the first week
    for (let i = 0; i < firstDay; i++) {
      this.days.push({});
    }

    // Add days of the month
    for (let d = 1; d <= numDays; d++) {
      const event = this.events.find(e => e.date === d);
      this.days.push(event ? { ...event, date: d } : { date: d });
    }

     this.weeks = [];
      for (let i = 0; i < this.days.length; i += 7) {
        this.weeks.push(this.days.slice(i, i + 7));
      }

    this.loadMonthYearData(month, year);
  }

  loadMonthYearData(month: number, year: number) {

    this.api.getMonthYearData(month + 1,year).subscribe({

      
      next: (res) => {
        this.ngZone.run(() => {
          this.monthData = res;
          this.cdr.detectChanges();
        });
        //this.mediaList = res.data;
        console.log(res);
      },
      error: (err) => console.error(err)
    });
  }

  animateSwipe(direction: 'left' | 'right') {
    const el = this.calendarContainer.nativeElement;
    el.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');

    setTimeout(() => {
      el.classList.remove('swipe-left');
      el.classList.remove('swipe-right');
    }, 200);
  }

  prevMonth() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.generateCalendar(this.month, this.year);

  }

  nextMonth() {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.generateCalendar(this.month, this.year);
  }

  async openDayDetails(day: any) {
    let dayData = this.getDayData(day);
    if(dayData == null) {
      return;
    }
    const modal = await this.modalCtrl.create({
      component: DayDetailsModalComponent,
      componentProps: {
        date: day.date,
        month: this.monthNames[this.month], 
        year: this.year,
        fullData: dayData
      },
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5
    });

    return modal.present();
  }

  

  getDayData(day: any) {

    if (!day?.date) return null;

      // const key = `day_${day.date}`;
      // return this.monthData["day_" + day.date ] ?? null;
      for(let dp of this.monthData) {
        if(dp.day == day.date) {
          return dp;
        }
      }
      return null;
  }

    isToday(d: any): boolean {
      if (!d.date) return false;

      const today = new Date();
      
      return (
        d.date === today.getDate() &&
        this.month === today.getMonth() &&
        this.year === today.getFullYear()
      );
    }

    hasFestival(day: any): boolean {
      if (!day?.date) return false;
      const dayData = this.getDayData(day);
      return !!(dayData?.festival?.trim());
    }

}