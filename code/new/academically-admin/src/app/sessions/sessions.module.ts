import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsRoutingModule } from './sessions-routing.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SessionsComponent } from './sessions.component';

@NgModule({
  declarations: [
    SessionsComponent,
  ],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    AppSharedModule,
  ],
})
export class SessionsModule { }
