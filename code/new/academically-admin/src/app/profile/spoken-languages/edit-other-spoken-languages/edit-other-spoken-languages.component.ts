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
}
