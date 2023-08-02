import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { WrapperComponent } from './layout/wrapper/wrapper.component';
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
            path: 'dashboard',
            loadChildren: () =>
              import('@app/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: 'home',
            loadChildren: () =>
              import('@app/home/home.module').then(
                (m) => m.HomeModule
              ),
          },
          {
            path: 'explore',
            loadChildren: () =>
              import('@app/explore/explore.module').then(
                (m) => m.ExploreModule
              )
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
            path: 'forums',
            loadChildren: () =>
              import('@app/forums/forums.module').then(
                (m) => m.ForumsModule
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
          {
            path: 'notifications',
            loadChildren: () =>
              import('@app/notifications/notifications.module').then(
                (m) => m.NotificationsModule
              ),
          },
          {
            path: 'tutor-portal',
            loadChildren: () =>
              import('@app/tutor-portal/tutor-portal.module').then(
                (m) => m.TutorPortalModule
              ),
          },
          {
            path: 'student-portal',
            loadChildren: () =>
              import('@app/student-portal/student-portal.module').then(
                (m) => m.StudentPortalModule
              ),
          },
          {
            path: 'lesson-preview',
            loadChildren: () => import('./lesson-preview/lesson-preview.module').then(m => m.LessonPreviewModule),
            data: { preload: true }
          },
          {
            path: 'videos',
            loadChildren: () =>
              import('@app/videos/videos.module').then(
                (m) => m.VideosModule
              ),
          },
          {
            path: 'articles',
            loadChildren: () =>
              import('@app/articles/articles.module').then(
                (m) => m.ArticlesModule
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
          {
            path: 'community',
            loadChildren: () =>
              import('@app/community/community.module').then(
                (m) => m.CommunityModule
              ),
          },
          {
            path: 'coaching',
            loadChildren: () =>
              import('@app/coaching/coaching.module').then(
                (m) => m.CoachingModule
              ),
          },
          {
            path: 'events',
            loadChildren: () =>
              import('@app/events/events.module').then(
                (m) => m.EventsModule
              ),
          },
          {
            path: 'course',
            loadChildren: () =>
              import('@app/course/course.module').then(
                (m) => m.CourseModule
              ),
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
