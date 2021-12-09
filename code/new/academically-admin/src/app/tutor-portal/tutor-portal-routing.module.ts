import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { TutorPortalComponent } from './tutor-portal.component';
import { CourseResolver } from './_resolvers/course.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':course-id',
        // data: { permission: 'Pages.PageBuilder' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        resolve: { user: CourseResolver },
        children: [
          {
            path: '',
            component: TutorPortalComponent,
            children: [
              {
                path: 'overview',
                loadChildren: () =>
                  import('@app/tutor-portal/overview/overview.module').then(
                    (m) => m.OverviewModule,
                  ),
              },
              {
                path: 'reviews',
                loadChildren: () =>
                  import('@app/tutor-portal/reviews/reviews.module').then(
                    (m) => m.ReviewsModule
                  ),
              },
              {
                path: 'students',
                loadChildren: () =>
                  import('@app/tutor-portal/students/students.module').then(
                    (m) => m.StudentsModule,
                  ),
              },
              {
                path: 'messages',
                loadChildren: () =>
                  import('@app/tutor-portal/messages/messages.module').then(
                    (m) => m.MessagesModule,
                  ),
              },
              {
                path: 'assignments',
                loadChildren: () =>
                  import('@app/tutor-portal/assignments/assignments.module').then(
                    (m) => m.AssignmentsModule,
                  ),
              },
              { path: '', redirectTo: 'overview' },
            ],
          },
          {
            path: 'student-course',
            loadChildren: () =>
              import('@app/tutor-portal/student-course/student-course.module').then(
                (m) => m.StudentCourseModule,
              ),
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
