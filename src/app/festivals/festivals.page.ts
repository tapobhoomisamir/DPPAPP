import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
import { LanguageService } from '../services/language-service';
import { ApiService } from '../api-service';

import { ChangeDetectorRef, OnInit } from '@angular/core';

interface RawEvent {
  date: string; // YYYY-MM-DD format
  [key: string]: any;
}

interface TransformedEvent {
  date: string; // Original date string
  day: string; // Translated short day name (e.g., 'बुध' for Wed)
  dateNum: string; // Translated date number (e.g., '१२')
  monthShort: string; // Translated short month name (e.g., 'नव')
  year: number; 
  [key: string]: any;
}
@Component({
  selector: 'app-fetivals',
  templateUrl: 'festivals.page.html',
  styleUrls: ['festivals.page.scss'],
  standalone: false,
})
export class FestivalsPage implements OnInit{

  selectedYear: number = new Date().getFullYear();
  

  // combinedList = [
  //   {
  //     title: 'Diwali Celebration',
  //     description: 'Watch our Diwali event highlights. Full details here...',
  //     short: 'Festival of lights and joy.',
  //     date: '2025-12-12',
  //     year: 2025,
  //     expanded: false
  //   },
  //   {
  //     title: 'Holi Festival',
  //     description: 'Enjoy the colors of Holi!',
  //     short: 'Festival of colors.',
  //     date: '2024-03-25',
  //     year: 2024,
  //     expanded: false
  //   },
  //   {
  //     title: 'Ganesh Chaturthi',
  //     description: 'Enjoy the colors of Holi!',
  //     short: 'Ganesh chaturthi is celebrated in western india.',
  //     date: '2024-04-25',
  //     year: 2024,
  //     expanded: false
  //   }
  //   // Add more items for different years
  // ];

   // Variable to hold the current language code
  currentLangCode: string = 'mr';

  keys = [
        'CALENDAR.MONTHS.JANUARY',
        'CALENDAR.MONTHS.FEBRUARY',
        'CALENDAR.MONTHS.MARCH',
        'CALENDAR.MONTHS.APRIL',
        'CALENDAR.MONTHS.MAY',
        'CALENDAR.MONTHS.JUNE',
        'CALENDAR.MONTHS.JULY',
        'CALENDAR.MONTHS.AUGUST',
        'CALENDAR.MONTHS.SEPTEMBER',
        'CALENDAR.MONTHS.OCTOBER',
        'CALENDAR.MONTHS.NOVEMBER',
        'CALENDAR.MONTHS.DECEMBER', 
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
        'CALENDAR.DATE.31',
        'CALENDAR.DIGITS.0',
        'CALENDAR.DIGITS.1',
        'CALENDAR.DIGITS.2',
        'CALENDAR.DIGITS.3',
        'CALENDAR.DIGITS.4',
        'CALENDAR.DIGITS.5',
        'CALENDAR.DIGITS.6',
        'CALENDAR.DIGITS.7',
        'CALENDAR.DIGITS.8',
        'CALENDAR.DIGITS.9',
        'TABS.YEAR'
        
    ];

    yearLabelDisplay = "Year";


 constructor(
        private translate: TranslateService,
        private languageService: LanguageService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private api: ApiService,
  ) {}

  ngOnInit() {

    // 1. Subscribe to the observable provided by the service
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLangCode = lang;
      this.translate.use(lang).subscribe({
          next: () => {
          this.updateFestivalContent();
      },
          error: (err) => {
              console.error("Error loading language file:", err);
              // Fallback logic if needed
          }
      });
    });
  }

  yearDisplayList: { [key: number]: string } = {};

  keepOrder = (a: any, b: any) => 0;

  toNumber(val: any): number {
  return parseInt(val, 10);
}

 transformEvents(
    data: any[], 
    weekNameMap: any, 
    monthShortNameMap: any, 
    dateDisplayMap: any
): any[] {
    const dayNamesFull = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const monthNamesFull = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    return data.map(event => {
        const dateObject = new Date(`${event.date}T00:00:00`);
        if (isNaN(dateObject.getTime())) return event;

        const dayKey = dayNamesFull[dateObject.getDay()];
        const monthKey = monthNamesFull[dateObject.getMonth()];
        const dateNum = dateObject.getDate().toString();

        this.yearDisplayList[dateObject.getFullYear()] =this.translateDigits(dateObject.getFullYear(), dateDisplayMap);

        return {
            ...event,
            // Use the keys to pull from your translation maps
            day: weekNameMap[dayKey] || dayKey,
            dateNum: dateDisplayMap[dateNum] || dateNum,
            monthShort: monthShortNameMap[monthKey] || monthKey,
            year: dateObject.getFullYear()
        };
    });
}

  transformedEvents: any[] = [];
rawEventData: any[] = [ /* your original data from API */ ];

 dateDisplay: { [key: string]: string } = {};
  weekName: { [key: string]: string } = {};
   monthShortName: { [key: string]: string } = {};

updateFestivalContent() {
    this.api.getFestivalData(this.currentLangCode).subscribe({

      next: (res) => {

        this.rawEventData = res;
      this.translate.get(this.keys).subscribe((res: { [key: string]: string }) => {
        this.ngZone.run(() => {

          this.yearLabelDisplay = res['TABS.YEAR'];
          // 1. First, update your local translation maps
          // (This is your existing code that fills this.dateDisplay, this.weekName, etc.)
          // Populate dateDisplay: { "1": "१", "2": "२" ... }
          for (let i = 1; i <= 31; i++) {
            this.dateDisplay[i.toString()] = res['CALENDAR.DATE.'+i.toString()] || 'CALENDAR.DATE.'+i.toString();
          }

          // Populate weekName: { "SUNDAY": "रवि" ... }
          const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
          days.forEach(d => this.weekName[d] = res['CALENDAR.WEEK_DAYS.'+d]);

          // Populate monthShortName: { "JANUARY": "जन" ... }
          const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          months.forEach(m => {
            // Assuming your JSON has keys like "JAN_SHORT"
            this.monthShortName[m] = res['CALENDAR.MONTHS.'+m] || res[m]; 
          });

          // 2. NOW, call transformEvents using those updated maps
          this.transformedEvents = this.transformEvents(
            this.rawEventData,
            this.weekName,
            this.monthShortName,
            this.dateDisplay
          );

          this.cdr.detectChanges();
        });
      });

      },
      error: (err) => console.error(err)
    });
   
}


  get filteredList() {
    const transformedData = this.transformEvents(this.rawEventData,this.weekName,this.monthShortName,this.dateDisplay);
    return transformedData.filter(item => item.year === this.selectedYear);
  }

  toggleExpand(index: number) {
    this.filteredList[index].expanded = !this.filteredList[index].expanded;
  }

  translateDigits(num: number, digitMap: { [key: string]: string }): string {
      const numStr = num.toString();
      let translated = '';
      for (let i = 0; i < numStr.length; i++) {
          const digit = numStr[i]; // '2', '0', '2', '4'
          // Use the translated digit from the map, or the original digit if not found
          translated += digitMap[digit] || digit; 
      }
      return translated;
  }

}
