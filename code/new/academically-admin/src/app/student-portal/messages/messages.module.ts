import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { StudentPortalModule } from '../student-portal.module';

import { MessagesComponent } from './messages.component';

@NgModule({
  declarations: [
    MessagesComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedModule,
    AppSharedModule,
    StudentPortalModule,
  ],
})
export class MessagesModule { }
