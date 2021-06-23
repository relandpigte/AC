import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ProjectProposalsComponent } from './project-proposals.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProjectProposalsComponent,
        data: { permission: 'Pages.Projects.Proposals' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ProjectProposalsRoutingModule { }
