import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewRoutingModule } from './preview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { CommentsModule as SharedCommentsModule } from '@app/_shared/modules/comments/comments.module';
import { QuestionsModule as SharedQuestionsModule } from '@app/_shared/modules/questions/questions.module';

import { PreviewComponent } from './preview.component';
import { SidebarComponent } from './_components/sidebar/sidebar.component';
import { HomeComponent } from './_components/home/home.component';
import { CommentsComponent } from './_components/comments/comments.component';
import { RelatedComponent } from './_components/home/related/related.component';
import { SeriesVideosComponent } from './_components/home/series-videos/series-videos.component';
import { QuestionsComponent } from './_components/questions/questions.component';
import { ReviewsComponent } from './_components/reviews/reviews.component';
import { LessonPreviewModule } from '@app/lesson-preview/lesson-preview.module';

@NgModule({
  declarations: [
    PreviewComponent,
    SidebarComponent,
    HomeComponent,
    CommentsComponent,
    RelatedComponent,
    SeriesVideosComponent,
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
