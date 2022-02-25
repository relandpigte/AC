import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { SharedModule } from '@shared/shared.module';

import { AppSharedModule } from '@app/_shared/app-shared.module';
import { PreviewModule } from '@app/videos/preview/preview.module';

@NgModule({
  declarations: [
    PortalComponent,
  ],
  imports: [
    CommonModule,
    PortalRoutingModule,
    SharedModule,
    AppSharedModule,
    PreviewModule,
  ],
})
export class PortalModule { }
