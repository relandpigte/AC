import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

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
          { path: 'terms-and-conditions', component: TermsAndConditionsComponent}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
