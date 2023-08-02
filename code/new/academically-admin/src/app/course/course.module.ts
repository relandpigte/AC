import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { HeaderComponent } from './_components/header/header.component';
import { CourseAboutModule } from '@app/course/about/about.module';
import { CourseReviewsModule } from '@app/course/reviews/reviews.module';


@NgModule({
  declarations: [
    CourseComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    AppSharedModule,
    CourseAboutModule,
    CourseReviewsModule
  ]
})
export class CourseModule { }
