import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRoutingModule } from './research-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import * as ProfileResearchModule from '@app/profile/research/research.module';

import { ResearchComponent } from './research.component';

@NgModule({
  declarations: [
    ResearchComponent,
  ],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule,
    AppSharedModule,
    ProfileResearchModule.ResearchModule,
  ]
})
export class ResearchModule { }
