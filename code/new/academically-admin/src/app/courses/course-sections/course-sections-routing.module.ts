import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseSectionsComponent } from './course-sections.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':course-section-id',
        component: CourseSectionsComponent,
        children: [
          {
            path: 'content',
            loadChildren: () =>
              import('@app/courses/course-sections/content/content.module').then(
                (m) => m.ContentModule
              ),
          },
          {
            path: 'details',
            loadChildren: () =>
              import('@app/courses/course-sections/details/details.module').then(
                (m) => m.DetailsModule
              ),
          },
          {
            path: 'settings',
            loadChildren: () =>
              import('@app/courses/course-sections/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          { path: '', redirectTo: 'content' },
        ]
      },
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class CourseSectionsRoutingModule { }
