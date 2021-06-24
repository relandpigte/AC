import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { ServiceCategoryComponent } from './service-category.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ServiceCategoryComponent,
        data: { permission: 'Pages.ServiceWizard.Category' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ServiceCategoryRoutingModule { }
