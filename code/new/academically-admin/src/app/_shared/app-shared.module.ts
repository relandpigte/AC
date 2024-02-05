
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

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
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';
import { RateAndReviewComponent } from '@shared/components/rate-and-review/rate-and-review.component';
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
import { InviteUserComponent } from '@shared/modals/invite-user/invite-user.component';
import { ShimmerComponent } from '@shared/components/shimmer/shimmer.component';
import { StarRatingReviewComponent } from '@shared/components/star-rating-review/star-rating-review.component';
import { PreviewLinksComponent } from '@shared/components/preview/links/links.component';
import { PreviewPostsComponent } from '@shared/components/preview/posts/posts.component';
import { PreviewServicesComponent } from '@shared/components/preview/services/services.component';
import { PreviewServiceReferenceComponent } from '@shared/components/preview/service-reference/service-reference.component';
import { NewPostFloaterComponent } from '@shared/components/new-post-floater/new-post-floater.component';

import { KeysPipe } from '@shared/pipes/keys.pipe';
import { ShortenPipe } from '@shared/pipes/shorten.pipe';
import { CommentHistoryComponent } from '@shared/modals/comment-history/comment-history.component';
import { ServiceReviewComponent } from '@shared/components/service-review/service-review.component';
import { ServiceCardDashboardComponent } from '@shared/components/service-card-dashboard/service-card-dashboard.component';
import { UserAvatarComponent } from '@shared/components/user-avatar/user-avatar.component';
import { ChatConversationMessageComponent } from '@shared/components/chat-conversation-message/chat-conversation-message.component';
import { ChatComposerComponent } from '@shared/components/chat-composer/chat-composer.component';
import { ChatConversationComponent } from '@shared/components/chat-conversation/chat-conversation.component';
import { ChatComposerConversationComponent } from '@shared/components/chat-composer-conversation/chat-composer-conversation.component';
import { ChatMessageInfoComponent } from '@shared/components/chat-message-info/chat-message-info.component';
import { ChatServiceAttachmentComponent } from '@shared/components/chat-service-attachment/chat-service-attachment.component';
import { NgPipesModule } from 'ngx-pipes';
import { ChatRecipientComponent } from '@shared/components/chat-recipient/chat-recipient.component';
import { EventQuestionsComponent } from '@shared/components/event-questions/event-questions.component';
import { EventQuestionsComposerComponent } from '@shared/components/event-questions-composer/event-questions-composer.component';
import { NotificationCardComponent } from '@shared/components/notification-card/notification-card.component';
import { ServiceChatComponent } from '@shared/modals/service-chat/service-chat.component';
import { ServiceChatConfirmationComponent } from '@shared/modals/service-chat/components/service-chat-confirmation/service-chat-confirmation.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { BookingServiceComponent } from '@shared/components/booking-service/booking-service.component';
import { BookingTakenComponent } from '@shared/components/booking-service/components/booking-taken/booking-taken.component';
import { LeaveReviewComponent } from '@shared/modals/leave-review/leave-review.component';
import { LeaveReviewConfirmationComponent } from '@shared/modals/leave-review-confirmation/leave-review-confirmation.component';
import { ServiceReviewStatsComponent } from '@shared/components/service-review-stats/service-review-stats.component';
import { ServiceNotificationPopupComponent } from '@shared/components/service-notification-popup/service-notification-popup.component';
import { SharedToFeedComponent } from '@shared/components/shared-to-feed/shared-to-feed.component';
import { ChangeTimezoneComponent } from '@shared/components/booking-service/components/change-timezone/change-timezone.component';
import { ConfirmTimezoneComponent } from '@shared/components/booking-service/components/confirm-timezone/confirm-timezone.component';
import { ServiceMetricsComponent } from '@shared/components/service-metrics/service-metrics.component';
import { ServiceCreateComponent } from '@shared/components/service-create/service-create.component';
import { ServiceCreateOfferComponent } from '@shared/components/service-create-offer/service-create-offer.component';
import { ServiceCreatePollComponent } from '@shared/components/service-create-poll/service-create-poll.component';
import { ServiceCreateQuizComponent } from '@shared/components/service-create-quiz/service-create-quiz.component';
import { ServiceCardOfferComponent } from '@shared/components/service-card-offer/service-card-offer.component';
import { CreateServiceComponent } from '@shared/modals/create-service/create-service.component';
import { ServiceCardActivityComponent } from '@shared/components/service-card-activity/service-card-activity.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  bootstrapPlugin,
  interactionPlugin,
  rrulePlugin,
]);

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
    InviteUserComponent,
    ServicePickerComponent,
    ServicePreviewComponent,
    ServicePreviewLiteComponent,
    CommunityComposerComponent,
    CommunityPostComponent,
    CommunityPostCardComponent,
    CommunityDiscussionsComponent,
    CommunitySideCardComponent,
    EmojiPickerComponent,
    PurchaseServiceComponent,
    RateAndReviewComponent,
    ReactionComponent,
    ReactionUsersComponent,
    ShimmerComponent,
    StarRatingReviewComponent,
    PreviewLinksComponent,
    PreviewPostsComponent,
    PreviewServicesComponent,
    PreviewServiceReferenceComponent,
    ShortenPipe,
    CommentHistoryComponent,
    NewPostFloaterComponent,
    ServiceReviewComponent,
    ServiceCardDashboardComponent,
    ChatConversationMessageComponent,
    UserAvatarComponent,
    ChatComposerComponent,
    ChatConversationComponent,
    ChatComposerConversationComponent,
    ChatMessageInfoComponent,
    ChatServiceAttachmentComponent,
    ChatRecipientComponent,
    EventQuestionsComponent,
    EventQuestionsComposerComponent,
    NotificationCardComponent,
    ServiceChatComponent,
    ServiceChatConfirmationComponent,
    DropzoneDirective,
    BookingServiceComponent,
    BookingTakenComponent,
    LeaveReviewComponent,
    LeaveReviewConfirmationComponent,
    ServiceReviewStatsComponent,
    ServiceNotificationPopupComponent,
    SharedToFeedComponent,
    ChangeTimezoneComponent,
    ConfirmTimezoneComponent,
    ServiceMetricsComponent,
    ServiceCreateComponent,
    ServiceCreateOfferComponent,
    ServiceCreatePollComponent,
    ServiceCreateQuizComponent,
    ServiceCardOfferComponent,
    CreateServiceComponent,
    ServiceCardActivityComponent
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
    EmojiModule,
    RouterModule,
    NgPipesModule,
    FullCalendarModule
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
    InviteUserComponent,
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
    PurchaseServiceComponent,
    RateAndReviewComponent,
    ReactionComponent,
    ReactionUsersComponent,
    ShimmerComponent,
    StarRatingReviewComponent,
    PreviewLinksComponent,
    PreviewPostsComponent,
    PreviewServicesComponent,
    PreviewServiceReferenceComponent,
    ShortenPipe,
    CommentHistoryComponent,
    NewPostFloaterComponent,
    ServiceReviewComponent,
    ServiceCardDashboardComponent,
    ChatConversationMessageComponent,
    UserAvatarComponent,
    ChatComposerComponent,
    ChatConversationComponent,
    ChatComposerConversationComponent,
    ChatMessageInfoComponent,
    ChatServiceAttachmentComponent,
    ChatRecipientComponent,
    EventQuestionsComponent,
    EventQuestionsComposerComponent,
    NotificationCardComponent,
    ServiceChatComponent,
    ServiceChatConfirmationComponent,
    BookingServiceComponent,
    BookingTakenComponent,
    LeaveReviewComponent,
    LeaveReviewConfirmationComponent,
    ServiceReviewStatsComponent,
    ServiceNotificationPopupComponent,
    SharedToFeedComponent,
    ChangeTimezoneComponent,
    ConfirmTimezoneComponent,
    ServiceMetricsComponent,
    ServiceCreateComponent,
    ServiceCreateOfferComponent,
    ServiceCreatePollComponent,
    ServiceCreateQuizComponent,
    ServiceCardOfferComponent,
    CreateServiceComponent,
    ServiceCardActivityComponent
  ],
})
export class AppSharedModule { }
