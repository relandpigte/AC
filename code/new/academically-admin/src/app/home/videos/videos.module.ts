import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideosRoutingModule } from './videos-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';

import { VideosComponent } from './videos.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    VideosComponent,
    GridComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule,
    AppSharedModule,
  ],
})
export class VideosModule { }
