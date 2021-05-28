import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferencesRoutingModule } from './references-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ReferencesComponent } from './references.component';

@NgModule({
  declarations: [
    ReferencesComponent,
  ],
  imports: [
    CommonModule,
    ReferencesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ReferencesModule { }
