import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SharedModule } from '@shared/shared.module';

import { SuggestionsComponent } from './suggestions.component';

@NgModule({
  declarations: [
    SuggestionsComponent,
  ],
  imports: [
    CommonModule,
    SuggestionsRoutingModule,
    SharedModule,
  ]
})
export class SuggestionsModule { }
