import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { CoursesComponent } from './courses.component';
import { DetailsComponent } from './_components/details/details.component';
import { SettingsComponent } from './_components/settings/settings.component';

@NgModule({
  declarations: [
    CoursesComponent,
    DetailsComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class CoursesModule { }
