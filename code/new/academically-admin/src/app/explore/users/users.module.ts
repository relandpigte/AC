import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';

import { ExploreUsersComponent } from './users.component';

@NgModule({
  declarations: [
    ExploreUsersComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class ExploreUsersModule { }
