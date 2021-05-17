import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureRoutingModule } from './profile-picture-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ProfilePictureComponent } from './profile-picture.component';

@NgModule({
  declarations: [
    ProfilePictureComponent,
  ],
  imports: [
    CommonModule,
    ProfilePictureRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ProfilePictureModule { }
