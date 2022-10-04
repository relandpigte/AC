import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ExploreForYouComponent } from './for-you.component';
import { ExploreForYouDetailsComponent } from './for-you-details/for-you-details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExploreForYouComponent,
        canActivate: [AppRouteGuard]
      },
      {
        path: ':type',
        component: ExploreForYouDetailsComponent,
        canActivate: [AppRouteGuard]
      },
      { path: '**', redirectTo: '' }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ForYouRoutingModule { }
