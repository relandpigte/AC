import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { SpacesRoutingModule } from './spaces-routing.module';

import { ExploreSpacesComponent } from './spaces.component';

@NgModule({
  declarations: [
    ExploreSpacesComponent,
  ],
  imports: [
    CommonModule,
    SpacesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreSpacesModule { }
