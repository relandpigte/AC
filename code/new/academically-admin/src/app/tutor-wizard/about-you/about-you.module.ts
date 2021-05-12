import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutYouRoutingModule } from './about-you-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { AboutYouComponent } from './about-you.component';

@NgModule({
  declarations: [
    AboutYouComponent,
  ],
  imports: [
    CommonModule,
    AboutYouRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class AboutYouModule { }
