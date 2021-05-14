import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionRoutingModule } from './introduction-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { VerificationsModule } from '@app/_shared/modules/verifications/verifications.module';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { IntroductionComponent } from './introduction.component';
import { MetricsComponent } from './_components/metrics/metrics.component';
import { AboutComponent } from './_components/about/about.component';
import { StudentReviewsComponent } from './_components/student-reviews/student-reviews.component';
import { TutorReviewsComponent } from './_components/tutor-reviews/tutor-reviews.component';
import { StarRatingComponent } from './_components/star-rating/star-rating.component';
import { SummaryComponent } from './_components/summary/summary.component';
import { LanguageSpokenComponent } from './_components/language-spoken/language-spoken.component';
import { EditLanguageSpokenComponent } from './_components/language-spoken/edit-language-spoken/edit-language-spoken.component';
import { EditOtherLanguageSpokenComponent } from './_components/language-spoken/edit-language-spoken/edit-other-language-spoken/edit-other-language-spoken.component';


@NgModule({
  declarations: [
    IntroductionComponent,
    MetricsComponent,
    LanguageSpokenComponent,
    EditLanguageSpokenComponent,
    EditOtherLanguageSpokenComponent,
    AboutComponent,
    StudentReviewsComponent,
    TutorReviewsComponent,
    StarRatingComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    IntroductionRoutingModule,
    SharedModule,
    AppSharedModule,
    VerificationsModule,
    QuillModule.forRoot(),
    NgxPaginationModule,
    PopoverModule.forRoot(),
  ],
})
export class IntroductionModule { }
