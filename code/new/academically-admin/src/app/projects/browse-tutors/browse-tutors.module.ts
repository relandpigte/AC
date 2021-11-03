import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseTutorsRoutingModule } from './browse-tutors-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { BrowseTutorsComponent } from './browse-tutors.component';
import { IntroductionModule } from '@app/profile/introduction/introduction.module';

@NgModule({
  declarations: [
    BrowseTutorsComponent,
  ],
  imports: [
    CommonModule,
    BrowseTutorsRoutingModule,
    SharedModule,
    AppSharedModule,
    IntroductionModule,
  ],
})
export class BrowseTutorsModule { }
