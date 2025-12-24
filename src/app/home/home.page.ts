import { Component } from '@angular/core';

import { ApiService } from '../api-service';
import { NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
import { LanguageService } from '../services/language-service';

import { ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {


  mediaList: any[] = [];

  constructor(private zone: NgZone,
        private api: ApiService,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService,
        private languageService: LanguageService
  ) {}

  refreshPullToRefreshText: string = 'Pull to refresh';
  refreshRefreshingText: string = 'Fetching latest updates...';
  currentLangCode: string = 'mr';

  ngOnInit(): void {

    const keys = [
      "TABS.HOME_REFRESH.PULL_TO_REFRESH",
      "TABS.HOME_REFRESH.REFRESHING"
    ];
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLangCode = lang;
      
      this.loadData();
      this.translate.use(lang).subscribe({
          next: () => {
              // Now that 'use(lang)' has finished loading the file, we can proceed
              this.translate.get(keys).subscribe((res: { [key: string]: string }) => {
        
                    // Update all properties safely inside the NgZone
                    this.zone.run(() => {

                      this.refreshPullToRefreshText = res["TABS.HOME_REFRESH.PULL_TO_REFRESH"] || 'Pull to refresh';
                      this.refreshRefreshingText = res["TABS.HOME_REFRESH.REFRESHING"] || 'Fetching latest updates...';
                      //  Force view update
                        this.cdr.detectChanges(); 
                      });
                  });
              
          },
          error: (err) => {
              console.error("Error loading language file:", err);
              // Fallback logic if needed
          }
      });
      
    });
  }
  loadData() {
    this.api.getMedias(this.currentLangCode).subscribe({

      
      next: (res) => {
        this.zone.run(() => {
          this.mediaList = res;
        });
        //this.mediaList = res.data;
        console.log(res);
      },
      error: (err) => console.error(err)
    });
  }

  handleRefresh(event: any) {
    this.api.getMedias().subscribe({
      next: (res) => {
        this.zone.run(() => {
          this.mediaList = res; // Update the list with fresh data
        });
        event.target.complete(); // Stop the spinner
      },
      error: (err) => {
        console.error(err);
        event.target.complete(); // Stop the spinner even if there is an error
      }
    });
  }
  // combinedList = [
  //     {
  //       title: 'Diwali Celebration',
  //       image: 'https://srigurudev.org/wp-content/uploads/2025/10/561094912_1430698389057832_2528066748501215224_n-520x245.jpg',
  //       link: 'https://www.youtube.com/watch?v=example1',
  //       description: 'Watch our Diwali event highlights.',
  //       short: 'Festival of lights and joy.',
  //       date: '2025-11-12',
  //       type: 'media'
  //     },
  //     {
  //       title: 'Latest News',
  //       image: 'https://srigurudev.org/wp-content/uploads/2025/11/f7c64241-134f-42e3-b814-ca6cfb5f0b82-1-520x245.jpg',
  //       link: 'https://www.example.com/news',
  //       description: 'Read the latest updates.',
  //       short: 'Breaking news and updates.',
  //       date: '2025-11-20',
  //       type: 'media'
  //     },
  //     {
  //       title: 'Urgent Update',
  //       image: 'https://srigurudev.org/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-18-at-8.01.40-PM.jpeg',
  //       link: 'https://www.example.com/urgent',
  //       short: 'Please read this important announcement.',
  //       date: '2025-11-22',
  //       type: 'important'
  //     },
  //     {
  //       title: 'New Latest News',
  //       image: 'https://srigurudev.org/wp-content/uploads/2023/05/nn1-1536x676.jpg',
  //       link: 'https://www.example.com/news',
  //       description: 'Read the latest updates.',
  //       short: 'Breaking news and updates.',
  //       date: '2025-11-20',
  //       type: 'media'
  //     },
  //     {
  //       title: 'New Latest News',
  //       image: 'https://srigurudev.org/wp-content/uploads/2024/08/949e2114-a330-4cef-a608-920b1c437e10-520x245.jpg',
  //       link: 'https://www.example.com/news',
  //       description: 'Read the latest updates.',
  //       short: 'Breaking news and updates.',
  //       date: '2025-11-20',
  //       type: 'media'
  //     }
  //   ];


  openLink(url: string) {
    window.open(url, '_blank');
  }

}
