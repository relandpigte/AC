import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { FollowingRoutingModule } from './following-routing.module';

import { FollowingComponent } from './following.component';

@NgModule({
  declarations: [
    FollowingComponent,
  ],
  imports: [
    CommonModule,
    FollowingRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    FollowingComponent
  ]
})
export class FollowingModule { }
