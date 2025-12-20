import { Component, Input,NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ChangeDetectorRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-day-details-modal',
  templateUrl: './day-details-modal.component.html',
  styleUrls: ['./day-details-modal.component.scss'],
  standalone: true,   // <-- add this
  imports: [
    CommonModule,     // <-- fixes *ngIf, *ngFor
    IonicModule       // <-- fixes ion-button, ion-item, ion-icon
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DayDetailsModalComponent implements OnInit{

  @Input() date: any;
  @Input() month: any;
  @Input() year: any;
  @Input() fullData: any;

  
  // Variable to hold the current language code
  currentLangCode: string = 'en';

  dateDetailsDisplay: { [key: string]: string } = {};

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
        private languageService: LanguageService
  ) {}

   ngOnInit() {
    // 1. Subscribe to the observable provided by the service
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLangCode = lang;
      this.translate.use(lang).subscribe({
          next: () => {
              // Now that 'use(lang)' has finished loading the file, we can proceed
              this.updateDisplay();
          },
          error: (err) => {
              console.error("Error loading language file:", err);
              // Fallback logic if needed
          }
      });
      
    });
  }

  updateDisplay()
  {

    // 1. Define all keys we need to translate (month and all week days)
    const detailsKeys = [
        'DATE_DETAILS.FESTIVAL',
        'DATE_DETAILS.SUNRISE',
        'DATE_DETAILS.SUNSET',
        'DATE_DETAILS.TITHI',
        'DATE_DETAILS.NAKSHATRA',
        'DATE_DETAILS.MOONRISE',
        'DATE_DETAILS.MOONSET',
        'DATE_DETAILS.PANCHANG',
        'DATE_DETAILS.DAYRATING',
        'DATE_DETAILS.DATE',
        'DATE_DETAILS.EVENTS'
    ];

    //    that emits an object containing all translations.
    this.translate.get(detailsKeys).subscribe((res: { [key: string]: string }) => {
        
        // 3. Update all properties safely inside the NgZone
        this.ngZone.run(() => {
            // Update month name
            for (let i = 0; i < detailsKeys.length; i++) {
                const fullKey = detailsKeys[i];

                // 1. Split the key by the dot ('.')
                const keyParts = fullKey.split('.'); 
                
                // 2. Get the last element of the array, which is the desired short key
                const shortKey = keyParts[keyParts.length - 1]; 
                // Example: 'DATE_DETAILS.FESTIVAL' -> ['DATE_DETAILS', 'FESTIVAL'] -> 'FESTIVAL'
                
                // Use the shortKey as the index for your dateDetailsDisplay map
                // The value is the actual translated string (res[fullKey])
                this.dateDetailsDisplay[shortKey] = res[fullKey] || shortKey;
            }
            
            // 4. Force view update
            this.cdr.markForCheck();
        });
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  openFestival(id: number) {
    this.close();
    this.router.navigate(['../festival-details', id]);
  }

  // Helper function to open external links safely
  openLink(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
