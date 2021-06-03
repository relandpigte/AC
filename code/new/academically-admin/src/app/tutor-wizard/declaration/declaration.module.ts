import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationRoutingModule } from './declaration-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { DeclarationComponent } from './declaration.component';

@NgModule({
  declarations: [
    DeclarationComponent,
  ],
  imports: [
    CommonModule,
    DeclarationRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class DeclarationModule { }
