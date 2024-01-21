import { CreateEditOfferComponent } from './_components/create-edit-offer/create-edit-offer.component';
import { OffersComponent } from './_components/offers/offers.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ResourcesComponent } from './resources.component';
import { PresentationMaterialsComponent } from './_components/presentation-materials/presentation-materials.component';
import { UploadPresentationMaterialComponent } from './_components/upload-presentation-material/upload-presentation-material.component';
import { HandoutsComponent } from './_components/handouts/handouts.component';
import { UploadHandoutComponent } from './_components/upload-handout/upload-handout.component';
import { PollsComponent } from './_components/polls/polls.component';
import { CreateEditPollComponent } from './_components/create-edit-poll/create-edit-poll.component';
import { SelectPollQuestionComponent } from './_components/select-poll-question/select-poll-question.component';

@NgModule({
  declarations: [
    ResourcesComponent,
    PresentationMaterialsComponent,
    UploadPresentationMaterialComponent,
    HandoutsComponent,
    UploadHandoutComponent,
    PollsComponent,
    CreateEditPollComponent,
    SelectPollQuestionComponent,
    OffersComponent,
    CreateEditOfferComponent
  ],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
  exports: [
    ResourcesComponent
  ]
})
export class ResourcesModule { }
