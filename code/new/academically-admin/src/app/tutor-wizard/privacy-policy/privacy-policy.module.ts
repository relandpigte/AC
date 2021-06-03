import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ServicesModule } from '@app/profile/services/services.module';

@NgModule({
  declarations: [
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule,
    SharedModule,
    AppSharedModule,
    ServicesModule
  ]
})
export class PrivacyPolicyModule { }
