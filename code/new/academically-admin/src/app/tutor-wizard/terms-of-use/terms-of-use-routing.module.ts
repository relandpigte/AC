import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { TermsOfUseComponent } from './terms-of-use.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: TermsOfUseComponent,
      data: { permission: 'Pages.TutorWizard.TermsOfUse' },
      canActivate: [AppRouteGuard],
      canActivateChild: [AppRouteGuard],
    },
  ])],
  exports: [RouterModule]
})
export class TermsOfUseRoutingModule { }
