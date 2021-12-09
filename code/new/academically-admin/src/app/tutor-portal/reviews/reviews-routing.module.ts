import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ReviewsComponent } from './reviews.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        // data: { permission: 'Pages.PageBuilder' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: ReviewsComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ReviewsRoutingModule { }
