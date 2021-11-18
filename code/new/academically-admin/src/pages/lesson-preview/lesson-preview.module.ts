import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonPreviewRoutingModule } from './lesson-preview-routing.module';
import { SharedModule } from '@shared/shared.module';
import { QuillModule } from 'ngx-quill';

import { LessonPreviewComponent } from './lesson-preview.component';
import { PagePreviewComponent } from './_components/page-preview/page-preview.component';
import { SectionPreviewComponent } from './_components/section-preview/section-preview.component';
import { ContentPreviewComponent } from './_components/content-preview/content-preview.component';
import { ComponentPreviewComponent } from './_components/component-preview/component-preview.component';
import { TextComponentPreviewComponent } from './_components/text-component-preview/text-component-preview.component';
import { ImageComponentPreviewComponent } from './_components/image-component-preview/image-component-preview.component';

@NgModule({
  declarations: [
    LessonPreviewComponent,
    PagePreviewComponent,
    SectionPreviewComponent,
    ContentPreviewComponent,
    ComponentPreviewComponent,
    TextComponentPreviewComponent,
    ImageComponentPreviewComponent,
  ],
  imports: [
    CommonModule,
    LessonPreviewRoutingModule,
    SharedModule,
    QuillModule.forRoot(),
  ],
})
export class LessonPreviewModule { }
