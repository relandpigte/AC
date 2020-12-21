import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountRoutingModule } from './account-routing.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountLanguagesComponent } from './layout/account-languages.component';
import { AccountHeaderComponent } from './layout/account-header.component';
import { AccountFooterComponent } from './layout/account-footer.component';

// tenants
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { TenantChangeDialogComponent } from './tenant/tenant-change-dialog.component';
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
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        SharedModule,
        ServiceProxyModule,
        AccountRoutingModule,
        ModalModule.forChild(),
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        AccountLanguagesComponent,
        AccountHeaderComponent,
        AccountFooterComponent,
        // tenant
        TenantChangeComponent,
        TenantChangeDialogComponent,
        CompleteRegistrationComponent,
        TermsAndConditionsComponent,
        TwoFactorAuthenticationComponent,
        NotFoundComponent,
        ResetPasswordComponent,
        CompleteResetPasswordComponent,
        GuardianApprovalComponent,
        ThankYouComponent,
    ],
    entryComponents: [
        // tenant
        TenantChangeDialogComponent
    ]
})
export class AccountModule {

}
