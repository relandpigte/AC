import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCategoryRoutingModule } from './service-category-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServiceCategoryComponent } from './service-category.component';

@NgModule({
  declarations: [
    ServiceCategoryComponent,
  ],
  imports: [
    CommonModule,
    ServiceCategoryRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ServiceCategoryModule { }
