import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsOfUseRoutingModule } from './terms-of-use-routing.module';
import { TermsOfUseComponent } from './terms-of-use.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { ServicesModule } from '@app/profile/services/services.module';

@NgModule({
  declarations: [
    TermsOfUseComponent
  ],
  imports: [
    CommonModule,
    TermsOfUseRoutingModule,
    SharedModule,
    AppSharedModule,
    ServicesModule
  ]
})
export class TermsOfUseModule { }
