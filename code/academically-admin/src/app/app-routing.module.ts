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

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppComponent,
        children: [
          { path: 'home', component: HomeComponent, data: { permission: 'Pages.Dashboard' }, canActivate: [AppRouteGuard] },
          { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
          { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
          { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
          { path: 'about', component: AboutComponent },
          { path: 'update-password', component: ChangePasswordComponent },
          {
            path: 'academic-support',
            component: AcademicSupportComponent,
            data: { permission: 'Pages.Dashboard.Navigations.AcademicSupport' },
            canActivate: [AppRouteGuard]
          },
          {
            path: 'peer-support',
            component: PeerSupportComponent,
            data: { permission: 'Pages.PeerSupport' },
            canActivate: [AppRouteGuard]
          },
          {
            path: 'tutorial',
            component: PeerSupportTutorialComponent,
            data: { permission: 'Pages.PeerSupport.Tutorial' },
            canActivate: [AppRouteGuard]
          },
          {
            path: 'proposals',
            component: PeerSupportProposalsComponent,
            data: { permission: 'Pages.PeerSupport.Proposals' },
            canActivate: [AppRouteGuard]
          },
          {
            path: 'profile',
            component: ProfileComponent,
            data: { permission: 'Pages.Profile' },
            canActivate: [AppRouteGuard],
            canDeactivate: [CanDeactivateComponentGuard]
          },
          {
            path: 'settings',
            component: SettingsComponent,
            data: { permission: 'Pages.Settings' },
            canActivate: [AppRouteGuard]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
