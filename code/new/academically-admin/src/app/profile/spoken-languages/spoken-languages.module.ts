import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { AppSharedModule } from "@app/_shared/app-shared.module";
import { TreeModule } from "primeng/tree";
import { SpokenLanguagesComponent } from "./spoken-languages.component";
import { SpokenLanguagesFormComponent } from "./spoken-languages-form/spoken-languages-form.component";
import { EditOtherSpokenLanguagesComponent } from "./edit-other-spoken-languages/edit-other-spoken-languages.component";
import { EditSpokenLanguageModalComponent } from "./edit-spoken-languages-modal/edit-spoken-languages-modal.component";

@NgModule({
  declarations: [
      SpokenLanguagesComponent, 
      SpokenLanguagesFormComponent,
      EditSpokenLanguageModalComponent,
      EditOtherSpokenLanguagesComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppSharedModule,
    TreeModule,
  ],
  exports: [SpokenLanguagesComponent],
})
export class SpokenLanguagesModule {}
