import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ModalController } from '@ionic/angular';
import { DayDetailsModalComponent } from '../day-details-modal/day-details-modal.component';

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


  constructor(private modalCtrl: ModalController) {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.generateCalendar(this.month, this.year);
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
    const modal = await this.modalCtrl.create({
      component: DayDetailsModalComponent,
      componentProps: {
        date: day.date,
        fullData: this.getDayData(day)
      },
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5
    });

    return modal.present();
  }

  getDayData(day: any) {
      return {
        sunrise: "06:32 AM",
        sunset: "06:01 PM",
        moonrise: "07:42 PM",
        moonset: "06:10 AM",
        tithi: "Chaturthi",
        panchang: "Shubh",
        dayRating: "Auspicious",
        festival: "Karwa Chauth",
        festivalId: 22
      };
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


}