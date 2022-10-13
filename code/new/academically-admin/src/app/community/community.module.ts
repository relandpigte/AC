import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {AppSharedModule} from '@app/_shared/app-shared.module'
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { CommunityComposerComponent } from './composer/composer.component';

@NgModule({
  declarations: [
    CommunityComposerComponent,
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
