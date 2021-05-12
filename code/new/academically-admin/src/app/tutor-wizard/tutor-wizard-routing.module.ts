import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { BecomeATutorResolver } from './_resolvers/become-a-tutor.resolver';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { TutorWizardComponent } from './tutor-wizard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: WrapperComponent,
        data: { permission: 'Pages.TutorWizard' },
        canActivate: [AppRouteGuard],
        canActivateChild: [AppRouteGuard],
        resolve: { currentStep: BecomeATutorResolver },
        children: [
          {
            path: '',
            component: TutorWizardComponent,
            children: [
              {
                path: 'about-you',
                loadChildren: () =>
                  import('@app/tutor-wizard/about-you/about-you.module').then(
                    (m) => m.AboutYouModule,
                  ),
              },
              {
                path: 'education',
                loadChildren: () =>
                  import('@app/tutor-wizard/education/education.module').then(
                    (m) => m.EducationModule,
                  ),
              },
              {
                path: 'research',
                loadChildren: () =>
                  import('@app/tutor-wizard/research/research.module').then(
                    (m) => m.ResearchModule,
                  ),
              },
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
export class TutorWizardRoutingModule { }
