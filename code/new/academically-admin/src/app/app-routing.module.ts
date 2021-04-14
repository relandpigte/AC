import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ProfileGuard } from '@shared/guards/profile.guard';

import { WrapperComponent } from './layout/wrapper/wrapper.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
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
            path: 'profile',
            children: [
              {
                path: '',
                component: WrapperComponent,
                data: { permission: 'Pages.Profile' },
                canActivate: [AppRouteGuard, ProfileGuard],
                children: [
                  {
                    path: '',
                    component: ProfileHeaderComponent,
                    outlet: 'header',
                  },
                  {
                    path: '',
                    component: ProfileComponent,
                    outlet: 'content',
                  },
                ],
              },
              {
                path: ':user-id',
                component: WrapperComponent,
                data: { permission: 'Pages.Profile' },
                canActivate: [AppRouteGuard, ProfileGuard],
                children: [
                  {
                    path: '',
                    component: ProfileHeaderComponent,
                    outlet: 'header',
                  },
                  {
                    path: '',
                    component: ProfileComponent,
                    outlet: 'content',
                  },
                ],
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
          { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
          { path: 'about', component: AboutComponent },
          { path: 'update-password', component: ChangePasswordComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
