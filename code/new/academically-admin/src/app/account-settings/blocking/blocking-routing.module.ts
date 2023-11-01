import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { BlockingComponent } from '@app/account-settings/blocking/blocking.component';


const routes: Routes = [
  {
    path: '',
    component: BlockingComponent,
    data: { permission: 'Pages.AccountSettings' },
    canActivate: [AppRouteGuard],
    canActivateChild: [AppRouteGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockingRoutingModule { }
