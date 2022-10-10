import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { PopularRoutingModule } from './popular-routing.module';

import { PopularComponent } from './popular.component';

@NgModule({
  declarations: [
    PopularComponent,
  ],
  imports: [
    CommonModule,
    PopularRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    PopularComponent
  ]
})
export class PopularModule { }
