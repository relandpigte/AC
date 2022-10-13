import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import {AppSharedModule} from '@app/_shared/app-shared.module'
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { CommunityComposerComponent } from './_components/composer/composer.component';
import { CommunitySideCardComponent } from './_components/side-card/side-card.component';

@NgModule({
  declarations: [
    CommunityComposerComponent,
    CommunitySideCardComponent,
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
