import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ConversationsRoutingModule } from './converstaions-routing.module';

import { ConversationsComponent } from './conversations.component';
import { ConversationComponent } from './_components/conversation/conversation.component';
import {NgxDropzoneModule } from 'ngx-dropzone'

@NgModule({
  declarations: [
    ConversationsComponent,
    ConversationComponent,
  ],
  imports: [
    CommonModule,
    ConversationsRoutingModule,
    SharedModule,
    AppSharedModule,
    NgxDropzoneModule
  ],
  exports: [
    ConversationComponent,
  ]
})
export class ConversationsModule { }
