import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {EventListModule} from './event-list/event-list.module';
import {TeachingComponent} from './teaching.component';


@NgModule({
  declarations: [TeachingComponent],
  imports: [
    CommonModule,
    EventListModule,
    SharedModule,
    AppSharedModule,
  ],
  exports : [TeachingComponent, EventListModule]
})
export class  TeachingModule { }
