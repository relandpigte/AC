import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';

import { ProfileComponent } from './profile.component';
import { HeaderComponent } from './_components/header/header.component';
import { CoverPhotoChangerComponent } from './_components/cover-photo-changer/cover-photo-changer.component';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    ProfileComponent,
    HeaderComponent,
    CoverPhotoChangerComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProfileModule { }
