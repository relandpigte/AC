import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferRoutingModule } from './offer-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { OfferComponent } from './offer.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
    OfferComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    OfferRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class OfferModule { }
