import { Component, Injector, Input, OnInit } from "@angular/core";
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
export class SpokenLanguagesComponent extends AppComponentBase implements OnInit {
  @Input() userId: number;
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
  }

  ngOnInit(): void {
    this.getUserSpokenLanguage();
   }

  onEdit(): void {
    this.showEditUserSpokenLanguages();
  }

  canCreate(): boolean {
    return this.isGranted('Pages.TutorWizard.Languages.Create') ||
      this.isGranted('Pages.Profile.Languages.Create');
  }

  private getUserSpokenLanguage(): void {
    this.isLoading = true;
    this._userSpokenlanguageServiceProxy
      .getUserSpokenLanguages(this.userId ?? this._appSession.userId)
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
