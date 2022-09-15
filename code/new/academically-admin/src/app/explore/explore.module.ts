import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { ExploreRoutingModule } from './explore-routing.module';

import { ExploreComponent } from './explore.component';

@NgModule({
  declarations: [
    ExploreComponent,
  ],
  imports: [
    CommonModule,
    ExploreRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreModule { }
