import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { ForYouRoutingModule } from './for-you-routing.module';

import { ExploreForYouComponent } from './for-you.component';
import { ExploreForYouDetailsComponent } from './for-you-details/for-you-details.component';

@NgModule({
  declarations: [
    ExploreForYouComponent,
    ExploreForYouDetailsComponent
  ],
  imports: [
    CommonModule,
    ForYouRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreForYouModule { }
