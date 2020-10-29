import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'complete-registration/:id', component: CompleteRegistrationComponent },
          { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
          { path: 'two-factor-authentication', component: TwoFactorAuthenticationComponent },
          { path: '404', component: NotFoundComponent },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
