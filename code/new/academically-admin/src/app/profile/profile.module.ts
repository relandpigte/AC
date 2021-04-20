import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ProfileComponent } from './profile.component';
import { HeaderComponent } from './_components/header/header.component';
import { CoverPhotoChangerComponent } from './_components/cover-photo-changer/cover-photo-changer.component';
import { ProfilePictureChangerComponent } from './_components/profile-picture-changer/profile-picture-changer.component';

@NgModule({
  declarations: [
    ProfileComponent,
    HeaderComponent,
    CoverPhotoChangerComponent,
    ProfilePictureChangerComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot({
      container: 'body',
    }),
  ],
})
export class ProfileModule { }
