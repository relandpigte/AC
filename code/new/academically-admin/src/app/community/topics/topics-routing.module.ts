import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { TopicsComponent } from './topics.component';

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
            component: TopicsComponent,
            children: [
              { path: '', redirectTo: 'all' },
              {
                path: 'all',
                loadChildren: () =>
                  import('./all/all.module').then(
                    (m) => m.AllModule
                  ),
              },
              {
                path: 'view/:id',
                loadChildren: () =>
                  import('./children/children.module').then(
                    (m) => m.ChildrenModule
                  ),
              },
              {
                path: 'following',
                loadChildren: () =>
                  import('./following/following.module').then(
                    (m) => m.FollowingModule
                  ),
              },
              {
                path: 'usage',
                loadChildren: () =>
                  import('./usage/usage.module').then(
                    (m) => m.UsageModule
                  ),
              },
            ]
          }
        ],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TopicsRoutingModule { }
