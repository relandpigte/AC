import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '../_shared/app-shared.module';
import { SearchFilterComponent } from './_components/search-filter/search-filter.component';
import { SearchUsersComponent } from './_components/search-users/search-users.component';
import { SearchKeywordComponent } from './_components/search-keyword/search-keyword.component';


@NgModule({
  declarations: [
    ChatComponent,
    SearchFilterComponent,
    SearchUsersComponent,
    SearchKeywordComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class ChatModule { }
