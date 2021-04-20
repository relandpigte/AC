import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { VerificationsComponent } from './verifications.component';
import { MobileVerificationComponent } from './mobile-verification/mobile-verification.component';
import { PassportVerificationComponent } from './passport-verification/passport-verification.component';


@NgModule({
  declarations: [
    VerificationsComponent,
    MobileVerificationComponent,
    PassportVerificationComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    NgxIntlTelInputModule,
  ],
  exports: [
    VerificationsComponent,
  ]
})
export class VerificationsModule { }
