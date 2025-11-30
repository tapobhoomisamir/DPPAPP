import { Component } from '@angular/core';

@Component({
  selector: 'app-fetivals',
  templateUrl: 'festivals.page.html',
  styleUrls: ['festivals.page.scss'],
  standalone: false,
})
export class FestivalsPage {

  years = [2024, 2025, 2026];
  selectedYear = 2025;
  

  combinedList = [
    {
      title: 'Diwali Celebration',
      description: 'Watch our Diwali event highlights. Full details here...',
      short: 'Festival of lights and joy.',
      date: '2025-11-12',
      day: 'Wed',
      dateNum: '12',
      monthShort: 'Nov',
      year: 2025,
      expanded: false
    },
    {
      title: 'Holi Festival',
      description: 'Enjoy the colors of Holi!',
      short: 'Festival of colors.',
      date: '2024-03-25',
      day: 'Mon',
      dateNum: '25',
      monthShort: 'Mar',
      year: 2024,
      expanded: false
    },
    {
      title: 'Ganesh Chaturthi',
      description: 'Enjoy the colors of Holi!',
      short: 'Ganesh chaturthi is celebrated in western india.',
      date: '2024-03-25',
      day: 'Mon',
      dateNum: '9',
      monthShort: 'Sep',
      year: 2024,
      expanded: false
    }
    // Add more items for different years
  ];

  get filteredList() {
    return this.combinedList.filter(item => item.year === this.selectedYear);
  }

  toggleExpand(index: number) {
    this.filteredList[index].expanded = !this.filteredList[index].expanded;
  }

}
