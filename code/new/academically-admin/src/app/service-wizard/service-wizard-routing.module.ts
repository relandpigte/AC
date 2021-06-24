import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServiceWizardComponent } from './service-wizard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.ServiceWizard' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: ServiceWizardComponent,
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('@app/service-wizard/service-category/service-category.module').then(
                    (m) => m.ServiceCategoryModule,
                  ),
              },
              {
                path: 'service-level',
                loadChildren: () =>
                  import('@app/service-wizard/service-level/service-level.module').then(
                    (m) => m.ServiceLevelModule,
                  ),
              },
              {
                path: 'services',
                loadChildren: () =>
                  import('@app/service-wizard/service-selection/service-selection.module').then(
                    (m) => m.ServiceSelectionModule,
                  ),
              },
              {
                path: 'create',
                loadChildren: () =>
                  import('@app/service-wizard/create-project/create-project.module').then(
                    (m) => m.CreateProjectModule,
                  ),
              },
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
export class ServiceWizardRoutingModule { }
