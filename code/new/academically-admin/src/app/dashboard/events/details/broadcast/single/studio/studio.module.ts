import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioRoutingModule } from './studio-routing.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { StudioComponent } from './studio.component';
import { InvitePresenterComponent } from './_components/invite-presenter/invite-presenter.component';
import { InvitePresenterByEmailComponent } from './_components/invite-presenter-by-email/invite-presenter-by-email.component';

@NgModule({
  declarations: [
    StudioComponent,
    InvitePresenterComponent,
    InvitePresenterByEmailComponent,
  ],
  imports: [
    CommonModule,
    StudioRoutingModule,
    SharedModule,
    AppSharedModule,
    PermissionsModule,
  ],
  exports: [
    StudioComponent
  ]
})
export class StudioModule { }
