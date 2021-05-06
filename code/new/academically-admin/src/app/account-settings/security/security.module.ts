import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { SecurityComponent } from './security.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TwoFactorAuthenticationComponent } from './_components/two-factor-authentication/two-factor-authentication.component';
import { ChangePasswordComponent } from './_components/change-password/change-password.component';

@NgModule({
  declarations: [
    SecurityComponent,
    TwoFactorAuthenticationComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    SharedModule,
    AppSharedModule,
    NgxQRCodeModule,
  ]
})
export class SecurityModule { }
