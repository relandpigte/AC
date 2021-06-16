import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from './layout/wrapper/wrapper.component';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { CreateProjectComponent } from './create-project/create-project.component';

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
              },
            ],
          },
          {
            path: 'new-project',
            component: WrapperComponent,
            // data: { permission: 'Pages.Dashboard' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: CreateProjectComponent,
              },
            ],
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('@app/profile/profile.module').then(
                (m) => m.ProfileModule
              ),
          },
          {
            path: 'account-settings',
            loadChildren: () =>
              import('@app/account-settings/account-settings.module').then(
                (m) => m.AccountSettingsModule
              ),
          },
          {
            path: 'suggestions',
            loadChildren: () =>
              import('@app/suggestions/suggestions.module').then(
                (m) => m.SuggestionsModule
              ),
          },
          {
            path: 'tutor-wizard',
            loadChildren: () =>
              import('@app/tutor-wizard/tutor-wizard.module').then(
                (m) => m.TutorWizardModule
              ),
          },
          {
            path: 'service-wizard',
            loadChildren: () =>
              import('@app/service-wizard/service-wizard.module').then(
                (m) => m.ServiceWizardModule
              ),
          },
          {
            path: 'projects',
            loadChildren: () =>
              import('@app/projects/projects.module').then(
                (m) => m.ProjectsModule
              ),
          },
          {
            path: 'calendar',
            loadChildren: () =>
              import('@app/calendar/calendar.module').then(
                (m) => m.CalendarModule
              ),
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
