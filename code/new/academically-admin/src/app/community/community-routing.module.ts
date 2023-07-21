import { NgModule } from '@angular/core';
import { CommunityComponent } from './community.component';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';

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
            component: CommunityComponent,
            children: [
                {
                  path: 'following',
                  loadChildren: () =>
                    import('@app/community/following/following.module').then(
                      (m) => m.FollowingModule
                    ),
                },
                {
                  path: 'popular',
                  loadChildren: () =>
                    import('@app/community/popular/popular.module').then(
                      (m) => m.PopularModule
                    ),
                },
                {
                  path: 'discussion/:id',
                  loadChildren: () =>
                    import('@app/community/discussion/discussion.module').then(
                      (m) => m.DiscussionModule
                    ),
                },
                {
                  path: 'edit-history/:id',
                  loadChildren: () =>
                    import('@app/community/edit-history/edit-history.module').then(
                      (m) => m.EditHistoryModule
                    ),
                },
              {
                path: 'post/:id',
                loadChildren: () =>
                  import('@app/community/post/post.module').then(
                    (m) => m.PostModule
                  ),
              }
            ]
          },
        ],
      },
      {
        path: 'topics',
        loadChildren: () =>
          import('./topics/topics.module').then(
            (m) => m.TopicsModule
          ),
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CommunityRoutingModule { }
