import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CreateWorkshopComponent } from './_components/create-workshop/create-workshop.component';
import { WorkshopComponent } from './workshop.component';

@NgModule({
  declarations: [
    WorkshopComponent,
    CreateWorkshopComponent
  ],
  imports: [
    CommonModule,
    WorkshopRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class WorkshopModule { }
