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
import { CalendarModule } from 'primeng/calendar';

import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { NgxMaskModule } from 'ngx-mask';

import { FixedHeightDirective } from './directives/fixed-height.directive';
import { BottomScrollerDirective } from './directives/bottom-scroller.directive';
import { SidebarCollapseDirective } from './directives/sidebar-collapse.directive';

import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { DocumentUploaderComponent } from './components/document-uploader/document-uploader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ProfilePictureChangerComponent } from './components/profile-picture-changer/profile-picture-changer.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
    ServiceCardComponent,
    ColorPickerComponent,
    WhiteboardComponent,
    DateFormatPipe,
    SafePipe,
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
    CalendarModule,
    PopoverModule.forRoot(),
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
    SafePipe,
    FixedHeightDirective,
    BottomScrollerDirective,
    SidebarCollapseDirective,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
    ServiceCardComponent,
    ColorPickerComponent,
    WhiteboardComponent,
    CalendarModule,
    PopoverModule,
  ],
})
export class AppSharedModule { }
