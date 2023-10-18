import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CoursesComponent } from './courses.component';
import { CourseTemplateComponent } from './course-template/course-template.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { CourseNameComponent } from './course-name/course-name.component';
import { TeachingComponent } from './teaching/teaching.component';
import { LearningComponent } from './learning/learning.component';
import { TeachingGridComponent } from './_components/teaching-grid/teaching-grid.component';
import { TeachingListComponent } from './_components/teaching-list/teaching-list.component';
import { LearningGridComponent } from './_components/learning-grid/learning-grid.component';
import { LearningListComponent } from './_components/learning-list/learning-list.component';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { CreatedComponent } from './_components/created/created.component';
import { PurchasedComponent } from './_components/purchased/purchased.component';
import { ForYouComponent } from '@app/dashboard/courses/_components/for-you/for-you.component';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseTemplateComponent,
    CourseWizardComponent,
    CourseNameComponent,
    TeachingComponent,
    LearningComponent,
    TeachingGridComponent,
    TeachingListComponent,
    LearningGridComponent,
    LearningListComponent,
    CreatedComponent,
    PurchasedComponent,
    ForYouComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    AppSharedModule,
    DashboardModule,
  ],
})
export class CoursesModule { }
