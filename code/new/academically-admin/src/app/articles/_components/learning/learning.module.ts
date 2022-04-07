import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {SavedModule} from './saved/saved.module';
import {PurchasedModule} from './purchased/purchased.module';
import {LearningComponent} from './learning.component';



@NgModule({
  declarations: [LearningComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    SavedModule,
    PurchasedModule,
  ], exports : [LearningComponent]
})
export class LearningModule { }
