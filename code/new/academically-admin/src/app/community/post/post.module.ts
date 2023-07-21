import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SharedModule } from '@shared/shared.module';

import { PostComponent } from './post.component';
import { PostRoutingModule } from '@app/community/post/post-routing.module';

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    PostRoutingModule
  ],
  exports: [
    PostComponent
  ]
})
export class PostModule {}
