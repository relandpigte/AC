import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnRoutingModule } from './learn-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { LearnComponent } from './learn.component';
import { LessonPreviewModule } from '@app/lesson-preview/lesson-preview.module';

@NgModule({
  declarations: [
    LearnComponent,
  ],
  imports: [
    CommonModule,
    LearnRoutingModule,
    SharedModule,
    AppSharedModule,
    LessonPreviewModule,
  ],
})
export class LearnModule { }
