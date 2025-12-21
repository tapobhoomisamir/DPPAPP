import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import OneSignal from 'onesignal-cordova-plugin';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private platform: Platform) { }

  public initOneSignal(): void {
    //alert("initOneSignal");
    // Only attempt to initialize if running on a native device (Capacitor/Cordova)
    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      //alert("platform is capacitor or cordova : " + this.platform.platforms());
      // Replace with your OneSignal App ID
      OneSignal.initialize("<OneSignal App ID>"); 

      // 1. Request Permission
      OneSignal.Notifications.requestPermission(true).then((accepted) => {
        console.log("Permission accepted: " + accepted);
      });
      
      // 2. Set Listeners (foreground, click, etc.)
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
        console.log("Notification received:", event.getNotification());
        event.getNotification().display();
      });
      
      OneSignal.Notifications.addEventListener('click', (event) => {
        console.log("Notification opened with data:", event.notification.additionalData);
        // Add your deep linking/navigation logic here
      });

      console.log('OneSignal Initialized.');
    } else {
      //alert("platform is not capacitor and cordova : " + this.platform.platforms());
      console.log('OneSignal initialization skipped on web.');
    }
  }
}
