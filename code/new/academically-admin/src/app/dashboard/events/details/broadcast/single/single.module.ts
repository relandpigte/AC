import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleRoutingModule } from './single-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SingleComponent } from './single.component';

@NgModule({
  declarations: [
    SingleComponent
    ],
  imports: [
    CommonModule,
    SingleRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class SingleModule { }
