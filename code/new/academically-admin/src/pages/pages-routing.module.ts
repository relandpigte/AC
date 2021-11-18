import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesComponent } from './pages.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PagesComponent,
        children: [
          { path: '404', component: NotFoundComponent },
          { path: '403', component: UnauthorizedComponent },
        ]
      },
      {
        path: 'lesson-preview',
        loadChildren: () => import('./lesson-preview/lesson-preview.module').then(m => m.LessonPreviewModule),
        data: { preload: true }
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }
