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
        data: { permission: 'Pages.TutorWizard' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        // resolve: { currentStep: ServiceWizardResolver },
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
