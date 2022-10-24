import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { TopicsRoutingModule } from './topics-routing.module';

import { DragulaModule } from 'ng2-dragula';
import { TopicsComponent } from './topics.component';

@NgModule({
  declarations: [
    TopicsComponent
  ],
  imports: [
    CommonModule,
    TopicsRoutingModule,
    SharedModule,
    AppSharedModule,
    DragulaModule.forRoot(),
  ]
})
export class TopicsModule { }
