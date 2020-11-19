import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { CanDeactivateComponentGuard } from '@shared/services/guards/can-deactivate-component.guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { PeerSupportTutorialComponent } from './academic-support/peer-support/peer-support-tutorial/peer-support-tutorial.component';
import { PeerSupportProposalsComponent } from './academic-support/peer-support/peer-support-proposals/peer-support-proposals.component';
import { AcademicSupportComponent } from './academic-support/academic-support.component';
import { PeerSupportComponent } from './academic-support/peer-support/peer-support.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';
import { StudentProposalComponent } from './student-proposal/student-proposal.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { WrapperComponent } from './layout/wrapper/wrapper.component';
import { ProfileHeaderComponent } from './profile/profile-header/profile-header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppComponent,
        children: [
          {
            path: 'home',
            component: WrapperComponent,
            data: { permission: 'Pages.Dashboard' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: HomeComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'users',
            component: WrapperComponent,
            data: { permission: 'Pages.Users' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: UsersComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'roles',
            component: WrapperComponent,
            data: { permission: 'Pages.Roles' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: RolesComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'tenants',
            component: WrapperComponent,
            data: { permission: 'Pages.Tenants' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: TenantsComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'academic-support',
            component: WrapperComponent,
            data: { permission: 'Pages.Dashboard.Navigations.AcademicSupport' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: AcademicSupportComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'peer-support',
            component: WrapperComponent,
            data: { permission: 'Pages.PeerSupport' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: PeerSupportComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'tutorial',
            component: WrapperComponent,
            data: { permission: 'Pages.PeerSupport.Tutorial' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: PeerSupportTutorialComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'proposals',
            component: WrapperComponent,
            data: { permission: 'Pages.PeerSupport.Proposals' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: PeerSupportProposalsComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'account',
            component: WrapperComponent,
            data: { permission: 'Pages.Account' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: AccountComponent,
                canDeactivate: [CanDeactivateComponentGuard],
                outlet: 'content',
              },
            ],
          },
          {
            path: 'profile',
            component: WrapperComponent,
            data: { permission: 'Pages.Profile' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: ProfileComponent,
                outlet: 'content',
              },
              {
                path: '',
                component: ProfileHeaderComponent,
                outlet: 'header',
              },
            ],
          },
          {
            path: 'profile/:userId',
            component: WrapperComponent,
            data: { permission: 'Pages.Profile.ViewTutor' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: ProfileComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'settings',
            component: WrapperComponent,
            data: { permission: 'Pages.Settings' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: SettingsComponent,
                outlet: 'content',
              },
            ],
          },
          {
            path: 'student-proposal/:tutorialId',
            component: WrapperComponent,
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: StudentProposalComponent,
                outlet: 'content',
              },
            ],
          },
          { path: 'about', component: AboutComponent },
          { path: 'update-password', component: ChangePasswordComponent },
          { path: 'not-found', component: ErrorPageComponent },
          { path: '**', redirectTo: 'not-found' },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
