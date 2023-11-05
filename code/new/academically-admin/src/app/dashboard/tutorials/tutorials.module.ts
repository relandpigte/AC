import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialsRoutingModule } from './tutorials-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { DashboardModule } from '@app/dashboard/dashboard.module';
import { TutorialsComponent } from './tutorials.component';
// import { CourseTemplateComponent } from './course-template/course-template.component';
// import { CourseWizardComponent } from './course-wizard/course-wizard.component';
// import { CourseNameComponent } from './course-name/course-name.component';
// import { TeachingComponent } from './teaching/teaching.component';
// import { LearningComponent } from './learning/learning.component';
// import { TeachingGridComponent } from './_components/teaching-grid/teaching-grid.component';
// import { TeachingListComponent } from './_components/teaching-list/teaching-list.component';
// import { LearningGridComponent } from './_components/learning-grid/learning-grid.component';
// import { LearningListComponent } from './_components/learning-list/learning-list.component';
import { CreatedComponent } from './_components/created/created.component';
import { PurchasedComponent } from './_components/purchased/purchased.component';
import { SavedComponent } from './_components/saved/saved.component';
import { ForYouComponent } from '@app/dashboard/tutorials/_components/for-you/for-you.component';

@NgModule({
  declarations: [
    TutorialsComponent,
    // CourseTemplateComponent,
    // CourseWizardComponent,
    // CourseNameComponent,
    // TeachingComponent,
    // LearningComponent,
    // TeachingGridComponent,
    // TeachingListComponent,
    // LearningGridComponent,
    // LearningListComponent,
    CreatedComponent,
    PurchasedComponent,
    SavedComponent,
    ForYouComponent
  ],
  imports: [
    CommonModule,
    TutorialsRoutingModule,
    SharedModule,
    AppSharedModule,
    DashboardModule
  ],
})
export class TutorialsModule { }
