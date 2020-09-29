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
import { TutorialComponent } from './academic-support/peer-support/tutorial/tutorial.component';
import { ProposalsComponent } from './academic-support/peer-support/proposals/proposals.component';

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
          { path: 'tutorial',
            component: TutorialComponent,
            data: { permission: 'Pages.PeerSupport.Tutorial'},
            canActivate: [AppRouteGuard]
          },
          { path: 'proposals',
            component: ProposalsComponent,
            data: { permission: 'Pages.PeerSupport.Proposals'},
            canActivate: [AppRouteGuard]
          },
          {
            path: 'profile',
            component: ProfileComponent,
            data: { permission: 'Pages.Profile' },
            canActivate: [AppRouteGuard],
            canDeactivate: [CanDeactivateComponentGuard]
          },
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
