import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRoutingModule } from './content-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ContentComponent } from './content.component';
import { EditorComponent } from './_components/editor/editor.component';
import { ViewerComponent } from './_components/viewer/viewer.component';
import { PageEditorComponent } from './_components/page-editor/page-editor.component';
import { CreateEditPageComponent } from './_components/create-edit-page/create-edit-page.component';
import { LessonEditorComponent } from './_components/lesson-editor/lesson-editor.component';
import { LessonViewerComponent } from './_components/lesson-viewer/lesson-viewer.component';
import { ComponentEditorComponent } from './_components/component-editor/component-editor.component';
import { ComponentViewerComponent } from './_components/component-viewer/component-viewer.component';
import { PageViewerComponent } from './_components/page-viewer/page-viewer.component';
import { AddComponentComponent } from './_components/add-component/add-component.component';
import { BodyTextComponentViewerComponent } from './_components/body-text-component-viewer/body-text-component-viewer.component';
import { BodyTextComponentEditorComponent } from './_components/body-text-component-editor/body-text-component-editor.component';
import { ImageComponentViewerComponent } from './_components/image-component-viewer/image-component-viewer.component';
import { ImageComponentEditorComponent } from './_components/image-component-editor/image-component-editor.component';
import { BannerImageComponentEditorComponent } from './_components/banner-image-component-editor/banner-image-component-editor.component';
import { BannerImageComponentViewerComponent } from './_components/banner-image-component-viewer/banner-image-component-viewer.component';

@NgModule({
  declarations: [
    ContentComponent,
    EditorComponent,
    ViewerComponent,
    PageEditorComponent,
    CreateEditPageComponent,
    LessonEditorComponent,
    LessonViewerComponent,
    ComponentEditorComponent,
    ComponentViewerComponent,
    PageViewerComponent,
    AddComponentComponent,
    BodyTextComponentViewerComponent,
    BodyTextComponentEditorComponent,
    ImageComponentViewerComponent,
    ImageComponentEditorComponent,
    BannerImageComponentEditorComponent,
    BannerImageComponentViewerComponent,
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ContentComponent,
  ],
})
export class ContentModule { }
