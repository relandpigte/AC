import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { AccountSettingsComponent } from './account-settings.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.AccountSettings' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        children: [
          {
            path: '',
            component: AccountSettingsComponent,
            children: [
              {
                path: 'general',
                loadChildren: () =>
                  import('@app/account-settings/general/general.module').then(
                    (m) => m.GeneralModule,
                  ),
              },
              {
                path: 'security',
                loadChildren: () =>
                  import('@app/account-settings/security/security.module').then(
                    (m) => m.SecurityModule,
                  ),
              },
              {
                path: 'notifications',
                loadChildren: () =>
                  import('@app/account-settings/notifications/notifications.module').then(
                    (m) => m.NotificationsModule,
                  ),
              },
              {
                path: 'blocking',
                loadChildren: () =>
                  import('@app/account-settings/blocking/blocking.module').then(
                    (m) => m.BlockingModule,
                  ),
              },
              { path: '', redirectTo: 'general' },
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
export class AccountSettingsRoutingModule { }
