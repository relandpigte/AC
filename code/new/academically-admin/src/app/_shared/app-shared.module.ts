import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';

import { DocumentUploaderComponent } from './components/document-uploader/document-uploader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ProfilePictureChangerComponent } from './components/profile-picture-changer/profile-picture-changer.component';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
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
    BsDropdownModule.forRoot({
      container: 'body',
    }),
  ],
  exports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    TypeaheadModule,
    QuillModule,
    NgxPaginationModule,
    TooltipModule,
    BsDropdownModule,
    EnumToArrayPipe,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
  ],
})
export class AppSharedModule { }
