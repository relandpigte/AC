import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSubjectsRoutingModule } from './service-subjects-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServiceSubjectsComponent } from './service-subjects.component';

@NgModule({
  declarations: [ServiceSubjectsComponent],
  imports: [
    CommonModule,
    ServiceSubjectsRoutingModule,
    SharedModule,
    AppSharedModule,
  ]
})
export class ServiceSubjectsModule { }
