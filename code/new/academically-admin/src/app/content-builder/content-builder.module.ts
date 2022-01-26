import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBuilderRoutingModule } from './content-builder-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ContentBuilderComponent } from './content-builder.component';
import { EditorComponent } from './_components/editors/editor/editor.component';
import { ViewerComponent } from './_components/viewers/viewer/viewer.component';
import { PageEditorComponent } from './_components/editors/page-editor/page-editor.component';
import { CreateEditPageComponent } from './_components/create-edit-page/create-edit-page.component';
import { LessonEditorComponent } from './_components/editors/lesson-editor/lesson-editor.component';
import { LessonViewerComponent } from './_components/viewers/lesson-viewer/lesson-viewer.component';
import { ComponentEditorComponent } from './_components/editors/component-editor/component-editor.component';
import { ComponentViewerComponent } from './_components/viewers/component-viewer/component-viewer.component';
import { PageViewerComponent } from './_components/viewers/page-viewer/page-viewer.component';
import { AddComponentComponent } from './_components/add-component/add-component.component';
import { BodyTextComponentViewerComponent } from './_components/viewers/body-text-component-viewer/body-text-component-viewer.component';
import { BodyTextComponentEditorComponent } from './_components/editors/body-text-component-editor/body-text-component-editor.component';
import { ImageComponentViewerComponent } from './_components/viewers/image-component-viewer/image-component-viewer.component';
import { ImageComponentEditorComponent } from './_components/editors/image-component-editor/image-component-editor.component';
import { BannerImageComponentEditorComponent } from './_components/editors/banner-image-component-editor/banner-image-component-editor.component';
import { BannerImageComponentViewerComponent } from './_components/viewers/banner-image-component-viewer/banner-image-component-viewer.component';
import { TitleComponentEditorComponent } from './_components/editors/title-component-editor/title-component-editor.component';
import { TitleComponentViewerComponent } from './_components/viewers/title-component-viewer/title-component-viewer.component';
import { SubtitleComponentViewerComponent } from './_components/viewers/subtitle-component-viewer/subtitle-component-viewer.component';
import { SubtitleComponentEditorComponent } from './_components/editors/subtitle-component-editor/subtitle-component-editor.component';

@NgModule({
  declarations: [
    ContentBuilderComponent,
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
    TitleComponentEditorComponent,
    TitleComponentViewerComponent,
    SubtitleComponentViewerComponent,
    SubtitleComponentEditorComponent,
  ],
  imports: [
    CommonModule,
    ContentBuilderRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ContentBuilderComponent,
    ViewerComponent,
  ],
})
export class ContentBuilderModule { }
