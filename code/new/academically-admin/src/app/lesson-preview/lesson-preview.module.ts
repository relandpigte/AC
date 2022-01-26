import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonPreviewRoutingModule } from './lesson-preview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { QuillModule } from 'ngx-quill';

import { LessonPreviewComponent } from './lesson-preview.component';
import { ContentBuilderModule } from '@app/content-builder/content-builder.module';

@NgModule({
  declarations: [
    LessonPreviewComponent,
  ],
  imports: [
    CommonModule,
    LessonPreviewRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
    ContentBuilderModule,
  ],
  exports: [
    LessonPreviewComponent,
  ],
})
export class LessonPreviewModule { }
