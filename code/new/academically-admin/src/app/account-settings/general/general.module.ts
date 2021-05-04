import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRoutingModule } from './general-routing.module';

import { GeneralComponent } from './general.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    GeneralComponent,
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    SharedModule,
    AppSharedModule,
    NgxIntlTelInputModule,
  ],
})
export class GeneralModule { }
