import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {

  // 1. Define supported languages (add/remove languages as needed)
  supportedLangs = [
    { code: 'mr', name: 'मराठी' } ,
    { code: 'en', name: 'English' },
  ];

  // 2. Variable to track the currently selected language
  selectedLang: string;

  constructor(private router: Router, private translate: TranslateService,private languageService: LanguageService) {
      this.translate.setDefaultLang('mr');
      // You can set the initial language here, or get it from device/storage
      this.translate.use('mr');

      // Determine initial language based on browser/default
      // const browserLang = this.translate.getBrowserLang();
      // const initialLang = browserLang && this.supportedLangs.some(l => l.code === browserLang) ? browserLang : 'mr';
      const initialLang = 'mr';

      this.translate.use(initialLang);
      this.selectedLang = initialLang;
      this.languageService.setLanguage(initialLang);
  }

  // 3. Method to switch language (called by the ion-select in the template)
  switchLanguage(event: any) {
    const lang = event.detail.value;
    this.translate.use(lang);
    this.languageService.setLanguage(lang);
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
