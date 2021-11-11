import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LessonPreviewComponent } from './lesson-preview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: LessonPreviewComponent,
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class LessonPreviewRoutingModule { }
