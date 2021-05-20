import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SpokenLanguageProficiency,
  UserSpokenLanguageDto,
  UserSpokenlanguageServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { EditSpokenLanguageModalComponent } from "./edit-spoken-languages-modal/edit-spoken-languages-modal.component";

@Component({
  selector: "app-spoken-languages",
  templateUrl: "./spoken-languages.component.html",
  styleUrls: ["./spoken-languages.component.less"],
})
export class SpokenLanguagesComponent
  extends AppComponentBase
  implements OnInit {
  userSpokenLanguages: UserSpokenLanguageDto[] = [];
  isLoading: boolean = false;
  SpokenLanguageProficiency = SpokenLanguageProficiency;

  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _modalService: BsModalService,
    private _userSpokenlanguageServiceProxy: UserSpokenlanguageServiceProxy
  ) {
    super(injector);
      this.getUserSpokenLanguage();
  }

  ngOnInit(): void { }

  onEdit(): void {
    this.showEditUserSpokenLanguages();
  }

  private getUserSpokenLanguage(): void {
    this.isLoading = true;
    this._userSpokenlanguageServiceProxy
      .getUserSpokenLanguages(this._appSession.user.id)
      .subscribe((result) => {
        this.userSpokenLanguages = result;
        this.isLoading = false;
      });
  }

  private showEditUserSpokenLanguages() {
    const modalSettings = this.defaultModalSettings;
    const modalRef = this._modalService.show(
      EditSpokenLanguageModalComponent,
      modalSettings
    );
    const modal: EditSpokenLanguageModalComponent = modalRef.content;
    modal.save.subscribe((result: boolean) => {
      if (result) {
        this.getUserSpokenLanguage();
      }
    });
  }
}
