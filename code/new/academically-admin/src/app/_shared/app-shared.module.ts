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
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from 'ngx-color-picker';

import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { NgxMaskModule } from 'ngx-mask';

import { FixedHeightDirective } from './directives/fixed-height.directive';
import { BottomScrollerDirective } from './directives/bottom-scroller.directive';
import { SidebarCollapseDirective } from './directives/sidebar-collapse.directive';


import { DocumentUploaderComponent } from './components/document-uploader/document-uploader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ProfilePictureChangerComponent } from './components/profile-picture-changer/profile-picture-changer.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
@NgModule({
  declarations: [
    EnumToArrayPipe,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
    ColorPickerComponent,
    DateFormatPipe,
    FixedHeightDirective,
    BottomScrollerDirective,
    SidebarCollapseDirective,
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
    TimepickerModule.forRoot(),
    ModalModule.forRoot(),
    DragulaModule.forRoot(),
    ColorPickerModule,
    NgxMaskModule.forRoot(),
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
    TimepickerModule,
    ModalModule,
    DragulaModule,
    ColorPickerModule,
    NgxMaskModule,
    EnumToArrayPipe,
    DateFormatPipe,
    FixedHeightDirective,
    BottomScrollerDirective,
    SidebarCollapseDirective,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
    ColorPickerComponent,
  ],
})
export class AppSharedModule { }
