// modules
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
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TreeModule } from 'primeng/tree';
// directives
import { Select2Directive } from '@shared/directives/select2.directive';
import { SunburstChartDirective } from '@shared/directives/sunburst-chart.directive';
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
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/menu/sidebar-menu/sidebar-menu.component';
import { TopbarMenuComponent } from './layout/menu/topbar-menu/topbar-menu.component';
import { SidebarSmallMenuComponent } from './layout/menu/sidebar-small-menu/sidebar-small-menu.component';
import { SidebarComponent } from './layout/navigations/sidebar/sidebar.component';
import { TopnavComponent } from './layout/navigations/topnav/topnav.component';
import { TopbarComponent } from './layout/navigations/topbar/topbar.component';
import { SidebarSmallComponent } from './layout/navigations/sidebar-small/sidebar-small.component';
// services
import { GoogleMapsService } from '@shared/services/google-maps.service';
import { ProfileService } from '@shared/services/profile.service';
// components
import { AppComponent } from './app.component';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSummaryWidgetComponent } from './widgets/profile-summary-widget/profile-summary-widget.component';
import { ProfileEducationComponent } from './profile/profile-education/profile-education.component';
import { ProfilePublicationsComponent } from './profile/profile-publications/profile-publications.component';
import { CreateEditProfileEducationComponent } from './profile/profile-education/create-edit-profile-education/create-edit-profile-education.component';
import { CreateEditPublicationComponent } from './profile/profile-publications/create-edit-publication/create-edit-publication.component';
import { ProposalsContactsWidgetsComponent } from './widgets/proposals-contacts-widgets/proposals-contacts-widgets.component';
import { ProfileAreasOfStudyComponent } from './profile/profile-areas-of-study/profile-areas-of-study.component';
import { AcademicSupportComponent } from './academic-support/academic-support.component';
import { ProfileKnowledgeBaseComponent } from './profile/profile-areas-of-study/profile-knowledge-base/profile-knowledge-base.component';
import { PeerSupportComponent } from './academic-support/peer-support/peer-support.component';
import { TaxonomySearchComponent } from './shared/taxonomy-search/taxonomy-search.component';
import { ThemeSettingsComponent } from './shared/theme-settings/theme-settings.component';
import { PeerSupportTutorialComponent } from './academic-support/peer-support/peer-support-tutorial/peer-support-tutorial.component';
import { PeerSupportProposalsComponent } from './academic-support/peer-support/peer-support-proposals/peer-support-proposals.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';
import { UserNavigationComponent } from './layout/navigations/user-navigation/user-navigation.component';
import { VerificationsWidgetComponent } from './widgets/verifications-widget/verifications-widget.component';
import { AccountComponent } from './account/account.component';
import { AccountDetailsComponent } from './account/account-details/account-details.component';
import { AccountPrivacyAndDataProtectionComponent } from './account/account-privacy-and-data-protection/account-privacy-and-data-protection.component';
import { StudyLevelsComponent } from './shared/study-levels/study-levels.component';
import { ProfileResearchMethodsComponent } from './profile/profile-research-methods/profile-research-methods.component';
import { ResearchMethodsSearchComponent } from './shared/research-methods-search/research-methods-search.component';
import { SupportServicesSearchComponent } from './shared/support-services-search/support-services-search.component';
import { ProfileSupportServicesComponent } from './profile/profile-support-services/profile-support-services.component';
import { RequestNewResearchMethodComponent } from './shared/research-methods-search/request-new-research-method/request-new-research-method.component';
import { RequestNewSupportServiceComponent } from './shared/support-services-search/request-new-support-service/request-new-support-service.component';
import { SessionRatesComponent } from './shared/session-rates/session-rates.component';
import { StudentProposalComponent } from './student-proposal/student-proposal.component';
import { StudentProposalOverviewComponent } from './student-proposal/student-proposal-overview/student-proposal-overview.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ReviseStudentProposalComponent } from './student-proposal/student-proposal-overview/revise-student-proposal/revise-student-proposal.component';
import { WrapperComponent } from './layout/wrapper/wrapper.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';

@NgModule({
  declarations: [
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
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    TopbarMenuComponent,
    TopnavComponent,
    UserNavigationComponent,
    // directives
    Select2Directive,
    SunburstChartDirective,
    // widgets
    ProfileSummaryWidgetComponent,
    ProposalsContactsWidgetsComponent,
    VerificationsWidgetComponent,
    // components
    ProfileComponent,
    ProfileEducationComponent,
    ProfilePublicationsComponent,
    CreateEditProfileEducationComponent,
    CreateEditPublicationComponent,
    ProfileAreasOfStudyComponent,
    AcademicSupportComponent,
    ProfileKnowledgeBaseComponent,
    PeerSupportComponent,
    TaxonomySearchComponent,
    ThemeSettingsComponent,
    TopbarComponent,
    SidebarSmallComponent,
    SidebarSmallMenuComponent,
    PeerSupportTutorialComponent,
    PeerSupportProposalsComponent,
    SettingsComponent,
    SettingsSecurityComponent,
    AccountComponent,
    AccountDetailsComponent,
    AccountPrivacyAndDataProtectionComponent,
    StudyLevelsComponent,
    ProfileResearchMethodsComponent,
    ResearchMethodsSearchComponent,
    SupportServicesSearchComponent,
    ProfileSupportServicesComponent,
    RequestNewResearchMethodComponent,
    RequestNewSupportServiceComponent,
    SessionRatesComponent,
    StudentProposalComponent,
    StudentProposalOverviewComponent,
    ErrorPageComponent,
    ReviseStudentProposalComponent
    WrapperComponent,
    ProfileHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxQRCodeModule,
    TreeModule
  ],
  providers: [GoogleMapsService, ProfileService],
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
    // academically
    CreateEditProfileEducationComponent,
    TaxonomySearchComponent,
    ThemeSettingsComponent,
    ResearchMethodsSearchComponent,
    SupportServicesSearchComponent,
    RequestNewResearchMethodComponent,
    RequestNewSupportServiceComponent
  ]
})
export class AppModule {}
