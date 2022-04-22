import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsRoutingModule } from './invitations-routing.module';

import { InvitationsComponent } from './invitations.component';

@NgModule({
  declarations: [
    InvitationsComponent,
  ],
  imports: [
    CommonModule,
    InvitationsRoutingModule,
  ],
})
export class InvitationsModule { }
