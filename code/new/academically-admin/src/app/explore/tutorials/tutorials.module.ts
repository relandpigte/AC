import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { TutorialsRoutingModule } from './tutorials-routing.module';

import { ExploreTutorialsComponent } from './tutorials.component';

@NgModule({
  declarations: [
    ExploreTutorialsComponent,
  ],
  imports: [
    CommonModule,
    TutorialsRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreTutorialsModule { }
