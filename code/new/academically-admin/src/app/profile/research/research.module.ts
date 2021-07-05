import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRoutingModule } from './research-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { TreeModule } from 'primeng/tree';

import { ResearchComponent } from './research.component';
import { InterestsComponent } from './_components/interests/interests.component';
import { CreateEditInterestComponent } from './_components/interests/create-edit-interest/create-edit-interest.component';
import { MethodologiesComponent } from './_components/methodologies/methodologies.component';
import { CreateEditMethodologyComponent } from './_components/methodologies/create-edit-methodology/create-edit-methodology.component';
import { ResearchMethodTreeComponent } from './_components/methodologies/research-method-tree/research-method-tree.component';
import { PublicationsComponent } from './_components/publications/publications.component';
import { CreateEditPublicationComponent } from './_components/publications/create-edit-publication/create-edit-publication.component';
import { ResearchFieldsTreeComponent } from './_components/interests/research-fields-tree/research-fields-tree.component';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [
    ResearchComponent,
    InterestsComponent,
    CreateEditInterestComponent,
    MethodologiesComponent,
    CreateEditMethodologyComponent,
    ResearchMethodTreeComponent,
    PublicationsComponent,
    CreateEditPublicationComponent,
    ResearchFieldsTreeComponent,
  ],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    SharedModule,
    AppSharedModule,
    TreeModule,
    PopoverModule.forRoot(),
  ],
  exports: [
    ResearchComponent,
  ],
})
export class ResearchModule { }
