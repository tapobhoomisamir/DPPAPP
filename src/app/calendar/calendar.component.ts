import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ModalController } from '@ionic/angular';
import { DayDetailsModalComponent } from '../day-details-modal/day-details-modal.component';
import { NgZone } from '@angular/core';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { ApiService } from '../api-service';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { LanguageService } from '../services/language-service';

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
export class CalendarComponent implements OnInit {
  month: number;
  year: number;
    days: { date?: number; label?: string; badge?: boolean; highlight?: boolean }[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weeks: { date?: number; label?: string; badge?: boolean; highlight?: boolean }[][] = [];
  monthNameDisplay: String;
  weekName = {'SUNDAY':'Sun','MONDAY':'Mon','TUESDAY':"Tue",'WEDNESDAY':'Wed','THURSDAY':'Thu','FRIDAY':'Fri','SATURDAY':'Sat'};

  dateDisplay: { [key: string]: string } = {
      "1":"1",
      "2":"2",
      "3":"3",
      "4":"4",
      "5":"5",
      "6":"6",
      "7":"7",
      "8":"8",
      "9":"9",
      "10":"10",
      "11":"11",
      "12":"12",
      "13":"13",
      "14":"14",
      "15":"15",
      "16":"16",
      "17":"17",
      "18":"18",
      "19":"19",
      "20":"20",
      "21":"21",
      "22":"22",
      "23":"23",
      "24":"24",
      "25":"25",
      "26":"26",
      "27":"27",
      "28":"28",
      "29":"29",
      "30":"30",
      "31":"31"
    };
  // Variable to hold the current language code
  currentLangCode: string = 'en';


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
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private languageService: LanguageService) {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.generateCalendar(this.month, this.year);
    this.monthNameDisplay = this.translate.instant("CALENDAR..MONTHS" + this.monthNames[this.month].toUpperCase());
  }

  ngOnInit() {
    // 1. Subscribe to the observable provided by the service
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLangCode = lang;
      this.translate.use(lang).subscribe({
          next: () => {
              // Now that 'use(lang)' has finished loading the file, we can proceed
              this.generateCalendar(this.month, this.year);
              
          },
          error: (err) => {
              console.error("Error loading language file:", err);
              // Fallback logic if needed
          }
      });
      
      // 2. Add your component logic here to respond to the language change
      //this.updateCalendarContent(lang); 
      
    });
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

  updateCalendarContent(lang: string) {
    let monthKey = "CALENDAR.MONTHS." + this.monthNames[this.month].toUpperCase();
    
    // 1. Define all keys we need to translate (month and all week days)
    const keys = [
        monthKey, 
        'CALENDAR.WEEK_DAYS.SUNDAY',
        'CALENDAR.WEEK_DAYS.MONDAY',
        'CALENDAR.WEEK_DAYS.TUESDAY',
        'CALENDAR.WEEK_DAYS.WEDNESDAY',
        'CALENDAR.WEEK_DAYS.THURSDAY',
        'CALENDAR.WEEK_DAYS.FRIDAY',
        'CALENDAR.WEEK_DAYS.SATURDAY',
        'CALENDAR.DATE.1',
        'CALENDAR.DATE.2',
        'CALENDAR.DATE.3',
        'CALENDAR.DATE.4',
        'CALENDAR.DATE.5',
        'CALENDAR.DATE.6',
        'CALENDAR.DATE.7',
        'CALENDAR.DATE.8',
        'CALENDAR.DATE.9',
        'CALENDAR.DATE.10',
        'CALENDAR.DATE.11',
        'CALENDAR.DATE.12',
        'CALENDAR.DATE.13',
        'CALENDAR.DATE.14',
        'CALENDAR.DATE.15',
        'CALENDAR.DATE.16',
        'CALENDAR.DATE.17',
        'CALENDAR.DATE.18',
        'CALENDAR.DATE.19',
        'CALENDAR.DATE.20',
        'CALENDAR.DATE.21',
        'CALENDAR.DATE.22',
        'CALENDAR.DATE.23',
        'CALENDAR.DATE.24',
        'CALENDAR.DATE.25',
        'CALENDAR.DATE.26',
        'CALENDAR.DATE.27',
        'CALENDAR.DATE.28',
        'CALENDAR.DATE.29',
        'CALENDAR.DATE.30',
        'CALENDAR.DATE.31'
        
    ];
    
    // 2. Use translate.get with an array of keys. It returns an Observable 
    //    that emits an object containing all translations.
    this.translate.get(keys).subscribe((res: { [key: string]: string }) => {
        
        // 3. Update all properties safely inside the NgZone
        this.ngZone.run(() => {
            
            // Update month name
            this.monthNameDisplay = res[monthKey]; 
            
            // Update week names
            this.weekName['SUNDAY'] = res['CALENDAR.WEEK_DAYS.SUNDAY'];
            this.weekName['MONDAY'] = res['CALENDAR.WEEK_DAYS.MONDAY'];
            this.weekName['TUESDAY'] = res['CALENDAR.WEEK_DAYS.TUESDAY'];
            this.weekName['WEDNESDAY'] = res['CALENDAR.WEEK_DAYS.WEDNESDAY'];
            this.weekName['THURSDAY'] = res['CALENDAR.WEEK_DAYS.THURSDAY'];
            this.weekName['FRIDAY'] = res['CALENDAR.WEEK_DAYS.FRIDAY'];
            this.weekName['SATURDAY'] = res['CALENDAR.WEEK_DAYS.SATURDAY'];

            this.dateDisplay['1'] = res['CALENDAR.DATE.1'];
            this.dateDisplay['2'] = res['CALENDAR.DATE.2'];
            this.dateDisplay['3'] = res['CALENDAR.DATE.3'];
            this.dateDisplay['4'] = res['CALENDAR.DATE.4'];
            this.dateDisplay['5'] = res['CALENDAR.DATE.5'];
            this.dateDisplay['6'] = res['CALENDAR.DATE.6'];
            this.dateDisplay['7'] = res['CALENDAR.DATE.7'];
            this.dateDisplay['8'] = res['CALENDAR.DATE.8'];
            this.dateDisplay['9'] = res['CALENDAR.DATE.9'];
            this.dateDisplay['10'] = res['CALENDAR.DATE.10'];
            this.dateDisplay['11'] = res['CALENDAR.DATE.11'];
            this.dateDisplay['12'] = res['CALENDAR.DATE.12'];
            this.dateDisplay['13'] = res['CALENDAR.DATE.13'];
            this.dateDisplay['14'] = res['CALENDAR.DATE.14'];
            this.dateDisplay['15'] = res['CALENDAR.DATE.15'];
            this.dateDisplay['16'] = res['CALENDAR.DATE.16'];
            this.dateDisplay['17'] = res['CALENDAR.DATE.17'];
            this.dateDisplay['18'] = res['CALENDAR.DATE.18'];
            this.dateDisplay['19'] = res['CALENDAR.DATE.19'];
            this.dateDisplay['20'] = res['CALENDAR.DATE.20'];
            this.dateDisplay['21'] = res['CALENDAR.DATE.21'];
            this.dateDisplay['22'] = res['CALENDAR.DATE.22'];
            this.dateDisplay['23'] = res['CALENDAR.DATE.23'];
            this.dateDisplay['24'] = res['CALENDAR.DATE.24'];
            this.dateDisplay['25'] = res['CALENDAR.DATE.25'];
            this.dateDisplay['26'] = res['CALENDAR.DATE.26'];
            this.dateDisplay['27'] = res['CALENDAR.DATE.27'];
            this.dateDisplay['28'] = res['CALENDAR.DATE.28'];
            this.dateDisplay['29'] = res['CALENDAR.DATE.29'];
            this.dateDisplay['30'] = res['CALENDAR.DATE.30'];
            this.dateDisplay['31'] = res['CALENDAR.DATE.31'];
                          

            console.log('Async Translation:', this.monthNameDisplay, this.weekName);

            // 4. Force view update
            this.cdr.detectChanges(); 
        });
    });
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

    this.updateCalendarContent(this.currentLangCode)

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