import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsRoutingModule } from './sessions-routing.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SessionsComponent } from './sessions.component';
import { ConversationsModule } from '@app/conversations/conversations.module';

@NgModule({
  declarations: [
    SessionsComponent,
  ],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    AppSharedModule,
    ConversationsModule,
  ],
})
export class SessionsModule { }
