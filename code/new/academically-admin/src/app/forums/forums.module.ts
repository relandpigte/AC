import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {AppSharedModule} from '@app/_shared/app-shared.module'
import { ForumsRoutingModule } from './forums-routing.module';
import { ForumsComponent } from './forums.component';
import { CreateEditForumComponent } from './_components/create-edit-forum/create-edit-forum.component';
@NgModule({
  declarations: [ForumsComponent, CreateEditForumComponent],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    ForumsRoutingModule
  ]
})
export class ForumsModule { }
