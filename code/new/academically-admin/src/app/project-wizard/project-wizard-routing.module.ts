import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ProjectWizardComponent } from './project-wizard.component';

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
            component: ProjectWizardComponent,
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('@app/project-wizard/service-category/service-category.module').then(
                    (m) => m.ServiceCategoryModule,
                  ),
              },
              {
                path: 'service-level',
                loadChildren: () =>
                  import('@app/project-wizard/service-level/service-level.module').then(
                    (m) => m.ServiceLevelModule,
                  ),
              },
              {
                path: 'services',
                loadChildren: () =>
                  import('@app/project-wizard/service-selection/service-selection.module').then(
                    (m) => m.ServiceSelectionModule,
                  ),
              },
              {
                path: 'create',
                loadChildren: () =>
                  import('@app/project-wizard/create-project/create-project.module').then(
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
