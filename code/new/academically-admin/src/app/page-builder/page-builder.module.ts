import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilderRoutingModule } from './page-builder-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { TagInputModule } from 'ngx-chips';
import { NgxMaskModule } from 'ngx-mask';

import { ContentComponent } from './_components/content/content.component';
import { PageBuilderComponent } from './page-builder.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { DetailsComponent } from './_components/details/details.component';
import { ContentPreviewComponent } from './_components/content/previews/content-preview/content-preview.component';
import { PagePreviewComponent } from './_components/content/previews/page-preview/page-preview.component';
import { SectionPreviewComponent } from './_components/content/previews/section-preview/section-preview.component';
import { ComponentPreviewComponent } from './_components/content/previews/component-preview/component-preview.component';
import { TextComponentPreviewComponent } from './_components/content/previews/text-component-preview/text-component-preview.component';
import { ImageComponentPreviewComponent } from './_components/content/previews/image-component-preview/image-component-preview.component';
import { HeaderComponentPreviewComponent } from './_components/content/previews/header-component-preview/header-component-preview.component';
import { ContentSelectorComponent } from './_components/content-selector/content-selector.component';
import { ContentEditorComponent } from './_components/content/editors/content-editor/content-editor.component';
import { PageEditorComponent } from './_components/content/editors/page-editor/page-editor.component';
import { SectionEditorComponent } from './_components/content/editors/section-editor/section-editor.component';
import { ComponentEditorComponent } from './_components/content/editors/component-editor/component-editor.component';
import { TextComponentEditorComponent } from './_components/content/editors/text-component-editor/text-component-editor.component';
import { ImageComponentEditorComponent } from './_components/content/editors/image-component-editor/image-component-editor.component';
import { HeaderComponentEditorComponent } from './_components/content/editors/header-component-editor/header-component-editor.component';

@NgModule({
  declarations: [
    PageBuilderComponent,
    SettingsComponent,
    DetailsComponent,
    ContentComponent,
    ContentPreviewComponent,
    PagePreviewComponent,
    SectionPreviewComponent,
    ComponentPreviewComponent,
    TextComponentPreviewComponent,
    ImageComponentPreviewComponent,
    HeaderComponentPreviewComponent,
    ContentSelectorComponent,
    ContentEditorComponent,
    PageEditorComponent,
    SectionEditorComponent,
    ComponentEditorComponent,
    TextComponentEditorComponent,
    ImageComponentEditorComponent,
    HeaderComponentEditorComponent,
  ],
  imports: [
    CommonModule,
    PageBuilderRoutingModule,
    SharedModule,
    AppSharedModule,
    TagInputModule,
    NgxMaskModule.forRoot()
  ],
})
export class PageBuilderModule { }
