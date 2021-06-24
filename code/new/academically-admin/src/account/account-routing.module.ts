import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompleteResetPasswordComponent } from './reset-password/complete-reset-password/complete-reset-password.component';

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
          { path: 'reset-password', component: ResetPasswordComponent },
          { path: 'complete-reset-password/:id', component: CompleteResetPasswordComponent },
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
