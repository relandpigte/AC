import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { StudentCourseComponent } from './student-course.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: StudentCourseComponent,
            children: [
              {
                path: 'progress',
                loadChildren: () =>
                  import('@app/tutor-portal/student-course/progress/progress.module').then(
                    (m) => m.ProgressModule,
                  ),
              },
              {
                path: 'messages',
                loadChildren: () =>
                  import('@app/tutor-portal/student-course/messages/messages.module').then(
                    (m) => m.MessagesModule,
                  ),
              },
              {
                path: 'assignments',
                loadChildren: () =>
                  import('@app/tutor-portal/student-course/assignments/assignments.module').then(
                    (m) => m.AssignmentsModule,
                  ),
              },
              { path: '', redirectTo: 'progress' },
            ],
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class StudentCourseRoutingModule { }
