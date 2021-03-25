import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { NgPipesModule } from 'ngx-pipes';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PopoverModule } from 'ngx-bootstrap/popover';


// directives
import { ChartDirective } from '@shared/directives/chart.directive';
import { DragClassUpdaterDirective } from '@shared/directives/drag-class-updater.directive';

// guards
import { ProfileGuard } from '@shared/guards/profile.guard';

// servuces
import { ProfileService } from '@shared/services/profile.service'

// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { WrapperComponent } from './layout/wrapper/wrapper.component';
import { ThemeSettingComponent } from './layout/theme-setting/theme-setting.component';
import { SidebarComponent } from './layout/navigations/sidebar/sidebar.component';
import { UserNavigationComponent } from './layout/navigations/user-navigation/user-navigation.component';
import { SidebarMenuComponent } from './layout/menu/sidebar-menu/sidebar-menu.component';
import { TopnavComponent } from './layout/navigations/topnav/topnav.component';
import { TopbarMenuComponent } from './layout/menu/topbar-menu/topbar-menu.component';
import { SidebarSmallComponent } from './layout/navigations/sidebar-small/sidebar-small.component';
import { SidebarSmallMenuComponent } from './layout/menu/sidebar-small-menu/sidebar-small-menu.component';
import { TopbarComponent } from './layout/navigations/topbar/topbar.component';
import { DashboardOverviewComponent } from './home/dashboard-overview/dashboard-overview.component';
import { RecentProjectsComponent } from './widgets/recent-projects/recent-projects.component';
import { RecentActivityComponent } from './widgets/recent-activity/recent-activity.component';
import { ProfileSummaryComponent } from './widgets/profile-summary/profile-summary.component';
import { VerificationsComponent } from './widgets/verifications/verifications.component';
import { DashboardProjectsComponent } from './home/dashboard-projects/dashboard-projects.component';
import { DashboardUsageComponent } from './home/dashboard-usage/dashboard-usage.component';
import { DashboardUsageOverviewComponent } from './home/dashboard-usage/dashboard-usage-overview/dashboard-usage-overview.component';
import { DashboardUsageOverviewGraphComponent } from './home/dashboard-usage/dashboard-usage-overview-graph/dashboard-usage-overview-graph.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';
import { ProfileIntroductionComponent } from './profile/profile-introduction/profile-introduction.component';
import { ProfileEducationComponent } from './profile/profile-education/profile-education.component';
import { ProfileResearchComponent } from './profile/profile-research/profile-research.component';
import { ProfileIndustryExperienceComponent } from './profile/profile-industry-experience/profile-industry-experience.component';
import { ProfileServicesComponent } from './profile/profile-services/profile-services.component';
import { ProfileIntroductionSummaryComponent } from './profile/profile-introduction/profile-introduction-summary/profile-introduction-summary.component';
import { ProfileIntroductionAboutComponent } from './profile/profile-introduction/profile-introduction-about/profile-introduction-about.component';
import { CoverPhotoChangerComponent } from './shared/components/cover-photo-changer/cover-photo-changer.component';
import { ImageCropperComponent } from './shared/components/image-cropper/image-cropper.component';
import { CreateEditProfileEducationComponent } from './profile/profile-education/create-edit-profile-education/create-edit-profile-education.component';
import { ProfileEducationLevelsComponent } from './profile/profile-education/profile-education-levels/profile-education-levels.component';
import { CreateEditProfileEducationLevelComponent } from './profile/profile-education/profile-education-levels/create-edit-profile-education-level/create-edit-profile-education-level.component';
import { VerifyMobileComponent } from './widgets/verifications/verify-mobile/verify-mobile.component';
import { ProfileStudentReviewsComponent } from './profile/profile-introduction/profile-student-reviews/profile-student-reviews.component';
import { ProfileTutorReviewsComponent } from './profile/profile-introduction/profile-tutor-reviews/profile-tutor-reviews.component';
import { StarRatingComponent } from './shared/components/star-rating/star-rating.component';
import { ProfileIntroductionMetricsComponent } from './profile/profile-introduction/profile-introduction-metrics/profile-introduction-metrics.component';
import { ProfileQualificationsComponent } from './profile/profile-education/profile-qualifications/profile-qualifications.component';
import { CreateEditProfileQualificationComponent } from './profile/profile-education/profile-qualifications/create-edit-profile-qualification/create-edit-profile-qualification.component';
import { DocumentUploaderComponent } from './shared/components/document-uploader/document-uploader.component';
import { ViewQualificationDocumentsComponent } from './profile/profile-education/profile-qualifications/view-qualification-documents/view-qualification-documents.component';
import { VerifyPassportComponent } from './widgets/verifications/verify-passport/verify-passport.component';
import { ProfilePictureChangerComponent } from './shared/components/profile-picture-changer/profile-picture-changer.component';

@NgModule({
  declarations: [
    //directives
    ChartDirective,
    DragClassUpdaterDirective,
    // components
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    WrapperComponent,
    ThemeSettingComponent,
    SidebarComponent,
    UserNavigationComponent,
    SidebarMenuComponent,
    TopnavComponent,
    TopbarMenuComponent,
    SidebarSmallComponent,
    SidebarSmallMenuComponent,
    TopbarComponent,
    // academically components
    DashboardOverviewComponent,
    RecentProjectsComponent,
    RecentActivityComponent,
    ProfileSummaryComponent,
    VerificationsComponent,
    DashboardProjectsComponent,
    DashboardUsageComponent,
    DashboardUsageOverviewComponent,
    DashboardUsageOverviewGraphComponent,
    ProfileComponent,
    ProfileHeaderComponent,
    ProfileIntroductionComponent,
    ProfileEducationComponent,
    ProfileResearchComponent,
    ProfileIndustryExperienceComponent,
    ProfileServicesComponent,
    ProfileIntroductionSummaryComponent,
    ProfileIntroductionAboutComponent,
    CoverPhotoChangerComponent,
    ImageCropperComponent,
    CreateEditProfileEducationComponent,
    ProfileEducationLevelsComponent,
    CreateEditProfileEducationLevelComponent,
    VerifyMobileComponent,
    ProfileStudentReviewsComponent,
    ProfileTutorReviewsComponent,
    StarRatingComponent,
    ProfileIntroductionMetricsComponent,
    ProfileQualificationsComponent,
    CreateEditProfileQualificationComponent,
    DocumentUploaderComponent,
    ViewQualificationDocumentsComponent,
    VerifyPassportComponent,
    ProfilePictureChangerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule.forRoot({
      container: 'body',
    }),
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    NgPipesModule,
    ImageCropperModule,
    TypeaheadModule.forRoot(),
    NgxIntlTelInputModule,
    PopoverModule.forRoot(),
  ],
  providers: [
    ProfileGuard,
    ProfileService,
  ],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
  ],
})
export class AppModule { }
