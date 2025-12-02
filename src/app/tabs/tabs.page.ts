import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {

  // 1. Define supported languages (add/remove languages as needed)
  supportedLangs = [
    { code: 'en', name: 'English' }, 
    { code: 'hi', name: 'हिन्दी' } // Example: Hindi
  ];

  // 2. Variable to track the currently selected language
  selectedLang: string;

  constructor(private router: Router, private translate: TranslateService) {
      this.translate.setDefaultLang('en');
      // You can set the initial language here, or get it from device/storage
      this.translate.use('en');

      // Determine initial language based on browser/default
      const browserLang = this.translate.getBrowserLang();
      const initialLang = browserLang && this.supportedLangs.some(l => l.code === browserLang) ? browserLang : 'en';

      this.translate.use(initialLang);
      this.selectedLang = initialLang;
  }

  // 3. Method to switch language (called by the ion-select in the template)
  switchLanguage(event: any) {
    const lang = event.detail.value;
    this.translate.use(lang);
  }

  goToHome() {
    this.router.navigate(['/tabs/home']);
  }

  goToCalendar() {
    this.router.navigate(['/tabs/calendar']);
  }

  goToFestivals() {
    this.router.navigate(['/tabs/festivals']);
  }

}
