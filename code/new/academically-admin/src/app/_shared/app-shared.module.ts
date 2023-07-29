
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SharedModule } from '@shared/shared.module';
import { DragulaModule } from 'ng2-dragula';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuillModule } from 'ngx-quill';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';

import { DateFormatPipe } from './pipes/date-format.pipe';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { SafePipe } from './pipes/safe.pipe';

import { BottomScrollerDirective } from './directives/bottom-scroller.directive';
import { FixedHeightDirective } from './directives/fixed-height.directive';
import { SidebarCollapseDirective } from './directives/sidebar-collapse.directive';

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DocumentUploaderComponent } from './components/document-uploader/document-uploader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ProfilePictureChangerComponent } from './components/profile-picture-changer/profile-picture-changer.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';

import { AttachmentPreviewComponent } from '@shared/components/attachment-preview/attachment-preview.component';
import { AttachmentViewerComponent } from '@shared/components/attachment-viewer/attachment-viewer.component';
import { AutocompleteComponent } from '@shared/components/autocomplete/autocomplete.component';
import { CardClusterComponent } from '@shared/components/card-cluster/card-cluster.component';
import { CarouselPillComponent } from '@shared/components/carousel-pill/carousel-pill.component';
import { CarouselWrapperComponent } from '@shared/components/carousel-wrapper/carousel-wrapper.component';
import { CommunityPostCardComponent } from '@shared/components/community-post/community-post.component';
import { CommunityDiscussionsComponent } from '@shared/components/community-discussions/community-discussions.component';
import { CommunityComposerComponent } from '@shared/components/composer/composer.component';
import { EmojiPickerComponent } from '@shared/components/emoji-picker/emoji-picker.component';
import { ReactionComponent } from '@shared/components/reaction/reaction.component';
import { ReactionUsersComponent } from '@shared/components/reaction-users/reaction-users.component';
import { FeaturedCarouselComponent } from '@shared/components/featured-carousel/featured-carousel.component';
import { PillPickerComponent } from '@shared/components/pill-picker/pill-picker.component';
import { CommunityPostComponent } from '@shared/components/post/post.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { ServiceCardComponent } from '@shared/components/service-card/service-card.component';
import { ServicePickerComponent } from '@shared/components/service-picker/service-picker.component';
import { ServicePreviewComponent } from '@shared/components/service-preview/service-preview.component';
import { ServicePreviewLiteComponent } from '@shared/components/service-preview-lite/service-preview-lite.component';
import { CommunitySideCardComponent } from '@shared/components/side-card/side-card.component';
import { TopicCardComponent } from '@shared/components/topic/topic.component';
import { TopicsFollowingComponent } from '@shared/components/topics-following/topics-following.component';
import { TopicsMoreComponent } from '@shared/components/topics-more/topics-more.component';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { AddServiceComponent } from '@shared/modals/add-service/add-service.component';
import { AddTopicsComponent } from '@shared/modals/add-topics/add-topics.component';
import { ShimmerComponent } from '@shared/components/shimmer/shimmer.component';
import { PreviewPostsComponent } from '@shared/components/preview/posts/posts.component';
import { PreviewServicesComponent } from '@shared/components/preview/services/services.component';
import { NewPostFloaterComponent } from '@shared/components/new-post-floater/new-post-floater.component';

import { KeysPipe } from '@shared/pipes/keys.pipe';
import { ShortenPipe } from '@shared/pipes/shorten.pipe';
import { CommentHistoryComponent } from '@shared/modals/comment-history/comment-history.component';
import { ServiceReviewComponent } from '@shared/components/service-review/service-review.component';

@NgModule({
  declarations: [
    EnumToArrayPipe,
    DocumentUploaderComponent,
    ImageCropperComponent,
    ImageGalleryComponent,
    ProfilePictureChangerComponent,
    CardClusterComponent,
    SearchComponent,
    ServiceCardComponent,
    TopicCardComponent,
    TopicsFollowingComponent,
    TopicsMoreComponent,
    CardClusterComponent,
    ColorPickerComponent,
    WhiteboardComponent,
    DateFormatPipe,
    SafePipe,
    FixedHeightDirective,
    BottomScrollerDirective,
    SidebarCollapseDirective,
    CarouselPillComponent,
    CarouselWrapperComponent,
    FeaturedCarouselComponent,
    KeysPipe,
    AutocompleteComponent,
    PillPickerComponent,
    UpsertPostComponent,
    AddServiceComponent,
    AddTopicsComponent,
    AttachmentPreviewComponent,
    AttachmentViewerComponent,
    ServicePickerComponent,
    ServicePreviewComponent,
    ServicePreviewLiteComponent,
    CommunityComposerComponent,
    CommunityPostComponent,
    CommunityPostCardComponent,
    CommunityDiscussionsComponent,
    CommunitySideCardComponent,
    EmojiPickerComponent,
    ReactionComponent,
    ReactionUsersComponent,
    ShimmerComponent,
    PreviewPostsComponent,
    PreviewServicesComponent,
    ShortenPipe,
    CommentHistoryComponent,
    NewPostFloaterComponent,
    ServiceReviewComponent
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
    CarouselModule,
    PickerModule,
    EmojiModule
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
    PickerModule,
    EmojiModule,
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
    CardClusterComponent,
    SearchComponent,
    ServiceCardComponent,
    TopicCardComponent,
    TopicsFollowingComponent,
    TopicsMoreComponent,
    ColorPickerComponent,
    WhiteboardComponent,
    CalendarModule,
    PopoverModule,
    CarouselPillComponent,
    CarouselWrapperComponent,
    FeaturedCarouselComponent,
    KeysPipe,
    UpsertPostComponent,
    AddServiceComponent,
    AddTopicsComponent,
    AutocompleteComponent,
    PillPickerComponent,
    AttachmentPreviewComponent,
    AttachmentViewerComponent,
    ServicePickerComponent,
    ServicePreviewComponent,
    ServicePreviewLiteComponent,
    CommunityComposerComponent,
    CommunityPostComponent,
    CommunityPostCardComponent,
    CommunityDiscussionsComponent,
    CommunitySideCardComponent,
    EmojiPickerComponent,
    ReactionComponent,
    ReactionUsersComponent,
    ShimmerComponent,
    PreviewPostsComponent,
    PreviewServicesComponent,
    ShortenPipe,
    CommentHistoryComponent,
    NewPostFloaterComponent,
    ServiceReviewComponent
  ],
})
export class AppSharedModule { }
