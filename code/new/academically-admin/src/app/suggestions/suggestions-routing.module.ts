import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { SuggestionsComponent } from './suggestions.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.Suggestions' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: SuggestionsComponent,
            children: [
              {
                path: 'service-subjects',
                loadChildren: () =>
                  import('@app/suggestions/service-subjects/service-subjects.module').then(
                    (m) => m.ServiceSubjectsModule,
                  ),
              },
              { path: '', redirectTo: 'service-subjects' },
            ]
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class SuggestionsRoutingModule { }
