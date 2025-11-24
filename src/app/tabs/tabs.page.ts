import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private router: Router) {}

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
