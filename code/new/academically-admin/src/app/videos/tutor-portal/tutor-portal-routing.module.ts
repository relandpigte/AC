import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TutorPortalComponent } from './tutor-portal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TutorPortalComponent,
        children: [
          {
            path: 'overview',
            loadChildren: () =>
              import('@app/videos/tutor-portal/overview/overview.module').then(
                (m) => m.OverviewModule,
              ),
          },
          { path: '', redirectTo: 'overview' },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class TutorPortalRoutingModule { }
