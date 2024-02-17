import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AppSharedModule } from '@app/_shared/app-shared.module';
import { SettingsComponent } from './settings.component';
import { CommentsModule } from '@app/_shared/modules/comments/comments.module';
@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    AppSharedModule,
    CommentsModule,
  ],
  exports: [
    SettingsComponent,
  ],
})
export class SettingsModule { }
