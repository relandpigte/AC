import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageVideoRoutingModule } from './manage-video-routing.module';

import { ManageVideoComponent } from './manage-video.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    ManageVideoComponent,
  ],
  imports: [
    CommonModule,
    ManageVideoRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ManageVideoModule { }
