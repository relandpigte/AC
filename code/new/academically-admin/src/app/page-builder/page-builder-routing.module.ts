import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { PageBuilderComponent } from './page-builder.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: WrapperComponent,
        data: { permission: 'Pages.PageBuilder' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: PageBuilderComponent,
          },
        ],
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class PageBuilderRoutingModule { }
