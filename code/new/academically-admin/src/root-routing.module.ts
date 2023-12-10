import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/app/explore/for-you', pathMatch: 'full' },
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
  {
    path: 'pages',
    loadChildren: () => import('pages/pages.module').then(m => m.PagesModule), // Lazy load pages module
    data: { preload: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: []
})
export class RootRoutingModule { }
