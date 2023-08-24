import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '../_shared/app-shared.module';
import { SearchFilterComponent } from './_components/search-filter/search-filter.component';
import { ConversationComponent } from './_components/conversation/conversation.component';
import { ComposerComponent } from './_components/composer/composer.component';
import { RecipientComponent } from './_components/recipient/recipient.component';


@NgModule({
  declarations: [
    ChatComponent,
    SearchFilterComponent,
    ConversationComponent,
    ComposerComponent,
    RecipientComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class ChatModule { }
