import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '../_shared/app-shared.module';
import { SearchFilterComponent } from './_components/search-filter/search-filter.component';
import { ConversationComponent } from './_components/conversation/conversation.component';
import { ComposerComponent } from './_components/composer/composer.component';
import { ComposerConversationComponent } from './_components/composer-conversation/composer-conversation.component';
import { RecipientComponent } from './_components/recipient/recipient.component';
import { MessageInfoComponent } from './_components/conversation/_components/message-info/message-info.component';
import { ServiceAttachmentComponent } from './_components/conversation/_components/service-attachment/service-attachment.component';
import { SearchUsersComponent } from './_components/search-users/search-users.component';


@NgModule({
  declarations: [
    ChatComponent,
    SearchFilterComponent,
    ConversationComponent,
    ComposerComponent,
    ComposerConversationComponent,
    RecipientComponent,
    MessageInfoComponent,
    ServiceAttachmentComponent,
    SearchUsersComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class ChatModule { }
