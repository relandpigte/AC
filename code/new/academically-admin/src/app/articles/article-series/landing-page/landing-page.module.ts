import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageRoutingModule } from './landing-page-routing.module';

import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class LandingPageModule { }
