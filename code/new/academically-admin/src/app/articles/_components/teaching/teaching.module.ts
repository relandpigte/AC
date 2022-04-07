import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { TeachingComponent } from './teaching.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';
import { ArticlesRoutingModule } from '@app/articles/articles-routing.module';


@NgModule({
  declarations: [TeachingComponent, GridComponent, ListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    ArticlesRoutingModule
  ],
  exports: [TeachingComponent, GridComponent, ListComponent]
})
export class TeachingModule { }
