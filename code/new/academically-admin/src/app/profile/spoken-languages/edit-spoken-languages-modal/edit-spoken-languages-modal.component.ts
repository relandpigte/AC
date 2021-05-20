import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { BsModalRef } from "ngx-bootstrap/modal";
import { SpokenLanguagesFormComponent } from "../spoken-languages-form/spoken-languages-form.component";

@Component({
  selector: "app-edit-spoken-language-form",
  templateUrl: "./edit-spoken-languages-modal.component.html",
  styleUrls: ["./edit-spoken-languages-modal.component.less"],
})
export class EditSpokenLanguageModalComponent
  extends AppComponentBase
  implements OnInit {
  @ViewChild(SpokenLanguagesFormComponent) spokenLanguagesForm: SpokenLanguagesFormComponent;
  @Output() save = new EventEmitter<boolean>();
  cancelLabel = this.l("Cancel");
  saveLabel = this.l("Save");
  savingLabel = `${this.l("Saving")}...`;
  isLoading = true;

  constructor(injector: Injector, private _modal: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void { }

  onCloseClick(): void {
    this._modal.hide();
  }

  onSave(): void {
    this.spokenLanguagesForm.onFormSubmit();
  }

  onSaveResult(result: boolean): void {
    if (result) {
      this._modal.hide();
    }
    this.save.emit(result);
  }

  onIsLoadingChange(value: boolean): void {
    this.isLoading = value;
  }
}
