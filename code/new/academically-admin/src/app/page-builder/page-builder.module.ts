import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { PageBuilderComponent } from './page-builder.component';
import { ContentComponent } from './_components/content/content.component';
import { PageComponentSelectorComponent } from './_components/page-component-selector/page-component-selector.component';
import { PageContentEditorComponent } from './_components/content/editors/page-content-editor/page-content-editor.component';
import { TextPageComponentEditorComponent } from './_components/content/editors/text-page-component-editor/text-page-component-editor.component';
import { ImagePageComponentEditorComponent } from './_components/content/editors/image-page-component-editor/image-page-component-editor.component';
import { TextPageComponentPreviewComponent } from './_components/content/previews/text-page-component-preview/text-page-component-preview.component';
import { ImagePageComponentPreviewComponent } from './_components/content/previews/image-page-component-preview/image-page-component-preview.component';
import { PageContentPreviewComponent } from './_components/content/previews/page-content-preview/page-content-preview.component';
import { PageSectionPreviewComponent } from './_components/content/previews/page-section-preview/page-section-preview.component';
import { PageSectionEditorComponent } from './_components/content/editors/page-section-editor/page-section-editor.component';
import { SettingsComponent } from './_components/settings/settings.component';

@NgModule({
  declarations: [
    PageBuilderComponent,
    ContentComponent,
    PageComponentSelectorComponent,
    PageContentEditorComponent,
    TextPageComponentEditorComponent,
    ImagePageComponentEditorComponent,
    TextPageComponentPreviewComponent,
    ImagePageComponentPreviewComponent,
    PageContentPreviewComponent,
    PageSectionPreviewComponent,
    PageSectionEditorComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class PageBuilderModule { }
