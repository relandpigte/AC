import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardianApprovalComponent } from 'non-users/guardian-approval/guardian-approval.component';
import { ThankYouComponent } from 'non-users/thank-you/thank-you.component';

const routes: Routes = [
  { path: '', redirectTo: '/app/home', pathMatch: 'full' },
  {
    path: 'account',
    loadChildren: () => import('account/account.module').then(m => m.AccountModule), // Lazy load account module
    data: { preload: true }
  },
  {
    path: 'app',
    loadChildren: () => import('app/app.module').then(m => m.AppModule), // Lazy load account module
    data: { preload: true }
  },
  { path: 'guardian-approval/:id', component: GuardianApprovalComponent, pathMatch: 'full' },
  { path: 'thank-you', component: ThankYouComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RootRoutingModule {}
