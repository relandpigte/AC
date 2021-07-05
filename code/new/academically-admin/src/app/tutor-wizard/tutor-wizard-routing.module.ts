import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

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
              {
                path: 'languages',
                loadChildren: () =>
                  import('@app/tutor-wizard/languages/languages.module').then(
                    (m) => m.LanguagesModule,
                  ),
              },
              {
                path: 'services-offered',
                loadChildren: () =>
                  import('@app/tutor-wizard/services-offered/services-offered.module').then(
                    (m) => m.ServicesOfferedModule,
                  ),
              },
              {
                path: 'profile-picture',
                loadChildren: () =>
                  import('@app/tutor-wizard/profile-picture/profile-picture.module').then(
                    (m) => m.ProfilePictureModule,
                  ),
              },
              {
                path: 'photo-id',
                loadChildren: () =>
                  import('@app/tutor-wizard/photo-id/photo-id.module').then(
                    (m) => m.PhotoIdModule,
                  ),
              },
              {
                path: 'address',
                loadChildren: () =>
                  import('@app/tutor-wizard/address/address.module').then(
                    (m) => m.AddressModule,
                  ),
              },
              {
                path: 'contact-number',
                loadChildren: () =>
                  import('@app/tutor-wizard/contact-number/contact-number.module').then(
                    (m) => m.ContactNumberModule,
                  ),
              },
              {
                path: 'references',
                loadChildren: () =>
                  import('@app/tutor-wizard/references/references.module').then(
                    (m) => m.ReferencesModule,
                  ),
              },
              {
                path: 'dbs-check',
                loadChildren: () =>
                  import('@app/tutor-wizard/dbs-check/dbs-check.module').then(
                    (m) => m.DbsCheckModule,
                  ),
              },
              {
                path: 'terms-of-use',
                loadChildren: () =>
                  import('@app/tutor-wizard/terms-of-use/terms-of-use.module').then(
                    (m) => m.TermsOfUseModule,
                  ),
              },
              {
                path: 'privacy-policy',
                loadChildren: () =>
                  import('@app/tutor-wizard/privacy-policy/privacy-policy.module').then(
                    (m) => m.PrivacyPolicyModule,
                  ),
              },
              {
                path: 'declaration',
                loadChildren: () =>
                  import('@app/tutor-wizard/declaration/declaration.module').then(
                    (m) => m.DeclarationModule,
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
