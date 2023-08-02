import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { CourseComponent } from '@app/course/course.component';
import { HeaderComponent } from '@app/course/_components/header/header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: HeaderComponent,
            outlet: 'header',
          },
          {
            path: '',
            component: CourseComponent,
            children: [
              {
                path: 'about',
                loadChildren: () =>
                  import('@app/course/about/about.module').then(
                    (m) => m.CourseAboutModule,
                  ),
              },
              {
                path: 'reviews',
                loadChildren: () =>
                  import('@app/course/reviews/reviews.module').then(
                    (m) => m.CourseReviewsModule,
                  ),
              },
              { path: '', redirectTo: 'about' },
              { path: '**', redirectTo: 'about' },
            ]
          }
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ],
})
export class CourseRoutingModule { }
