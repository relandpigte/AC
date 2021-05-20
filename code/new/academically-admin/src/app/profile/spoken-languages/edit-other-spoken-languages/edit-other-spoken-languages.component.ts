import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SpokenLanguageDto,
  SpokenLanguageProficiency,
  UserSpokenLanguageDto,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-other-spoken-language",
  templateUrl: "./edit-other-spoken-languages.component.html",
  styleUrls: ["./edit-other-spoken-languages.component.less"],
})
export class EditOtherSpokenLanguagesComponent
  extends AppComponentBase
  implements OnInit {
  @Input() unSelectedSpokenLanguages: SpokenLanguageDto[];
  @Input() editUserSpokenLanguage: UserSpokenLanguageDto = new UserSpokenLanguageDto();
  @Output() save = new EventEmitter<UserSpokenLanguageDto>();
  model: UserSpokenLanguageDto = new UserSpokenLanguageDto();
  SpokenLanguageProficiency = SpokenLanguageProficiency;

  constructor(injector: Injector, private _modal: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.model = this.editUserSpokenLanguage;
    console.log(this.model);
    if (!this.model.proficiency) {
      this.model.proficiency = SpokenLanguageProficiency.Basic;
    }
  }

  onFormSubmit(): void {
    if (!this.model.id) {
      this.model.id = this.uuidv4();
    }
    this.save.emit(this.model);
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  private uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
