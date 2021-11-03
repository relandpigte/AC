import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { ServicesComponent } from './services.component';
import { CreateEditServiceComponent } from './_components/create-edit-service/create-edit-service.component';
import { SuggestServiceSubjectComponent } from './_components/suggest-service-subject/suggest-service-subject.component';
import { StudyFieldsTreeComponent } from './_components/study-fields-tree/study-fields-tree.component';
import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    ServicesComponent,
    CreateEditServiceComponent,
    SuggestServiceSubjectComponent,
    StudyFieldsTreeComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    SharedModule,
    AppSharedModule,
    TreeModule,
  ],
  exports: [ServicesComponent],
})
export class ServicesModule { }
