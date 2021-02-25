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
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';

// directives
import { ChartDirective } from '@shared/directives/chart.directive';

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

@NgModule({
  declarations: [
    ChartDirective,
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
    DashboardOverviewComponent,
    RecentProjectsComponent,
    RecentActivityComponent,
    ProfileSummaryComponent,
    VerificationsComponent,
    DashboardProjectsComponent,
    DashboardUsageComponent,
    DashboardUsageOverviewComponent,
    DashboardUsageOverviewGraphComponent,
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
  ],
  providers: [],
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
export class AppModule {}
