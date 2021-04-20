import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ProfileResolver } from './_resolvers/profile.resolver';

import { WrapperComponent } from '@app/layout/wrapper/wrapper.component';
import { HeaderComponent } from './_components/header/header.component';
import { ProfileComponent } from './profile.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      ...['', ':user-id'].map(path => (
        {
          path,
          component: WrapperComponent,
          data: { permission: 'Pages.Profile' },
          canActivate: [AppRouteGuard],
          canActivateChild: [AppRouteGuard],
          resolve: { user: ProfileResolver },
          children: [
            {
              path: '',
              component: HeaderComponent,
              outlet: 'header',
            },
            {
              path: '',
              component: ProfileComponent,
              children: [
                {
                  path: 'introduction',
                  loadChildren: () =>
                    import('@app/profile/introduction/introduction.module').then(
                      (m) => m.IntroductionModule,
                    ),
                },
                {
                  path: 'education',
                  loadChildren: () =>
                    import('@app/profile/education/education.module').then(
                      (m) => m.EducationModule,
                    ),
                },
                {
                  path: 'research',
                  loadChildren: () =>
                    import('@app/profile/research/research.module').then(
                      (m) => m.ResearchModule,
                    ),
                },
                {
                  path: 'industry-experience',
                  loadChildren: () =>
                    import('@app/profile/industry-experience/industry-experience.module').then(
                      (m) => m.IndustryExperienceModule,
                    ),
                },
                {
                  path: 'services',
                  loadChildren: () =>
                    import('@app/profile/services/services.module').then(
                      (m) => m.ServicesModule,
                    ),
                },
                { path: '', redirectTo: 'introduction' },
              ]
            },
          ],
        } as Route
      )),
    ]),
  ],
  exports: [
    RouterModule
  ],
})
export class ProfileRoutingModule { }
