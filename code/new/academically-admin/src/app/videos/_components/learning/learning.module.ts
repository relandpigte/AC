import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LearningComponent} from '@app/videos/_components/learning/learning.component';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {SavedModule} from './saved/saved.module';
import {PurchasedModule} from './purchased/purchased.module';

@NgModule({
  declarations: [LearningComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    SavedModule,
    PurchasedModule
  ],
  exports : [LearningComponent]
})
export class LearningModule { }
