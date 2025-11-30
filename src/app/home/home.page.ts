import { Component } from '@angular/core';

import { ApiService } from '../api-service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {


  mediaList: any[] = [];

  constructor(private zone: NgZone,private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.api.getMedias().subscribe({

      
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
