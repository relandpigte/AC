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
import { TutorHomeComponent } from './tutor-home/tutor-home.component';

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
            path: 'project-wizard',
            loadChildren: () =>
              import('@app/project-wizard/project-wizard.module').then(
                (m) => m.ProjectWizardModule
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
          {
            path: 'tutor-applications',
            loadChildren: () =>
              import('@app/tutor-applications/tutor-applications.module').then(
                (m) => m.TutorAppliactionsModule
              ),
          },
          {
            path: 'sessions',
            loadChildren: () =>
              import('@app/sessions/sessions.module').then(
                (m) => m.SessionsModule
              ),
          },
          {
            path: 'conversations',
            loadChildren: () =>
              import('@app/conversations/conversations.module').then(
                (m) => m.ConversationsModule
              ),
          },
          {
            path: 'courses',
            loadChildren: () =>
              import('@app/courses/courses.module').then(
                (m) => m.CoursesModule
              ),
          },
          { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
          { path: 'about', component: AboutComponent },
          { path: 'update-password', component: ChangePasswordComponent },
          {
            path: 'tutor-home',
            component: WrapperComponent,
            data: { permission: 'Pages.TutorHome' },
            canActivate: [AppRouteGuard],
            children: [
              {
                path: '',
                component: TutorHomeComponent,
              },
            ],
          },
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
