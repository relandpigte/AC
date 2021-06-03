import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferencesRoutingModule } from './references-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { ReferencesComponent } from './references.component';
import { CreateEditReferenceComponent } from './create-edit-reference/create-edit-reference.component';

@NgModule({
  declarations: [
    ReferencesComponent,
    CreateEditReferenceComponent,
  ],
  imports: [
    CommonModule,
    ReferencesRoutingModule,
    SharedModule,
    AppSharedModule,
    NgxIntlTelInputModule,
  ],
})
export class ReferencesModule { }
