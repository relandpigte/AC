import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CommentsModule as SharedCommentsModule } from '@app/_shared/modules/comments/comments.module';
import { QuestionsModule as SharedQuestionsModule } from '@app/_shared/modules/questions/questions.module';
import { SharedModule } from '@shared/shared.module';
import { PreviewRoutingModule } from './preview-routing.module';

import { LessonPreviewModule } from '@app/lesson-preview/lesson-preview.module';
import { CommentsComponent } from './_components/comments/comments.component';
import { HomeComponent } from './_components/home/home.component';
import { QuestionsComponent } from './_components/questions/questions.component';
import { ReviewsComponent } from './_components/reviews/reviews.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { PreviewComponent } from './preview.component';

@NgModule({
  declarations: [
    PreviewComponent,
    SidebarComponent,
    HomeComponent,
    CommentsComponent,
    QuestionsComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    PreviewRoutingModule,
    SharedModule,
    AppSharedModule,
    SharedCommentsModule,
    SharedQuestionsModule,
    LessonPreviewModule,
  ],
  exports: [
    PreviewComponent,
  ],
})
export class PreviewModule { }
