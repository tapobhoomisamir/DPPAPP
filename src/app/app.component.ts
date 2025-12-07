import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationService } from './services/notification-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private notificationService: NotificationService) {
    this.platform.ready().then(() => {
      alert("Platform ready");
      // Call the service method after the platform is ready
      this.notificationService.initOneSignal(); 
    });
  }
}
