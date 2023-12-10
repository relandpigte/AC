import { Component } from '@angular/core';

@Component({
  selector: 'app-service-notification-popup',
  templateUrl: './service-notification-popup.component.html',
  styleUrls: ['./service-notification-popup.component.less']
})
export class ServiceNotificationPopupComponent  {
  toggleShow = true;

  onServicePopupClose(e: any): void {
    e.preventDefault();
    this.toggleShow = !this.toggleShow;
  }
}
