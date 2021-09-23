import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumRoutingModule } from './curriculum-routing.module';

import { CurriculumComponent } from './curriculum.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

@NgModule({
  declarations: [
    CurriculumComponent,
  ],
  imports: [
    CommonModule,
    CurriculumRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CurriculumModule { }
