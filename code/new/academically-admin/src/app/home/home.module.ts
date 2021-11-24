import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { HomeComponent } from './home.component';
import { CoursesComponent } from './_components/courses/courses.component';

@NgModule({
  declarations: [
    HomeComponent,
    CoursesComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class HomeModule { }
