import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompleteResetPasswordComponent } from './reset-password/complete-reset-password/complete-reset-password.component';
import { GuardianApprovalComponent } from './guardian-approval/guardian-approval.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

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
          { path: 'reset-password', component: ResetPasswordComponent },
          { path: 'complete-reset-password/:id', component: CompleteResetPasswordComponent },
          { path: 'guardian-approval/:id', component: GuardianApprovalComponent, pathMatch: 'full' },
          { path: 'thank-you', component: ThankYouComponent, pathMatch: 'full' },
          { path: '404', component: NotFoundComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
