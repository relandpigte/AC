import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';

@NgModule({
  declarations: [
    CommunityComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
