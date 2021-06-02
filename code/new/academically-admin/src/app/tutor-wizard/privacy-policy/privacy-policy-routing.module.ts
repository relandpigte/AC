import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { PrivacyPolicyComponent } from './privacy-policy.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: PrivacyPolicyComponent,
    data: { permission: 'Pages.TutorWizard.PrivacyPolicy' },
    canActivate: [AppRouteGuard],
    canActivateChild: [AppRouteGuard],
  }])],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
