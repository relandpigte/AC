import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent } from './questions.component';
import {AppSharedModule} from '../../app-shared.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    QuestionsComponent,
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule
  ],
  exports: [
    QuestionsComponent,
  ],
})
export class QuestionsModule { }
