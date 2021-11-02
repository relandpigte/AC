import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from '@app/notifications/notifications-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { NotificationsComponent } from './notifications.component';
import { NotificationsPreviewComponent } from './_components/notifications-preview/notifications-preview.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationsPreviewComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    NotificationsPreviewComponent,
  ],
})
export class NotificationsModule { }
