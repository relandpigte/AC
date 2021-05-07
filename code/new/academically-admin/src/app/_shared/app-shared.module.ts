import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';

import { DocumentUploaderComponent } from './components/document-uploader/document-uploader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    DocumentUploaderComponent,
    ImageCropperComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    TypeaheadModule.forRoot(),
    QuillModule.forRoot(),
    NgxPaginationModule,
    TooltipModule.forRoot(),
  ],
  exports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    DocumentUploaderComponent,
    ImageCropperComponent,
    TypeaheadModule,
    QuillModule,
    NgxPaginationModule,
    TooltipModule,
  ],
})
export class AppSharedModule { }
