import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import {PurchasedModule} from './purchased/purchased.module';
import {LearningComponent} from './learning.component';
import {SavedComponent} from './saved/saved.component';
@NgModule({
  declarations: [LearningComponent, SavedComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    PurchasedModule
  ], exports : [LearningComponent, SavedComponent]
})
export class LearningModule { }
