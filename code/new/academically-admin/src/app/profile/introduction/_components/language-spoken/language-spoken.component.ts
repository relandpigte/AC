import { Component, Injector, OnInit } from "@angular/core";
import { ProfileService } from "@app/profile/_services/profile.service";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SpokenLanguageProficiency,
  UserDto,
  UserSpokenLanguageDto,
  UserSpokenlanguageServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalService } from "ngx-bootstrap/modal";
import { EditLanguageSpokenComponent } from "./edit-language-spoken/edit-language-spoken.component";

@Component({
  selector: "app-language-spoken",
  templateUrl: "./language-spoken.component.html",
  styleUrls: ["./language-spoken.component.less"],
})
export class LanguageSpokenComponent
  extends AppComponentBase
  implements OnInit {
  user: UserDto;
  userSpokenLanguages: UserSpokenLanguageDto[];
  isLoading: boolean = false;
  SpokenLanguageProficiency = SpokenLanguageProficiency;

  constructor(
    injector: Injector,
    profileService: ProfileService,
    private _modalService: BsModalService,
    private _userSpokenlanguageServiceProxy: UserSpokenlanguageServiceProxy
  ) {
    super(injector);
    profileService.user$.subscribe((user) => {
      this.user = user;
      this.getUserSpokenLanguage();
    });
  }

  ngOnInit(): void { }

  onEdit(): void {
    this.showEditUserSpokenLanguages();
  }

  private getUserSpokenLanguage(): void {
    this.isLoading = true;
    this._userSpokenlanguageServiceProxy
      .getUserSpokenLanguages(this.user.id)
      .subscribe((result) => {
        this.userSpokenLanguages = result;
        this.isLoading = false;
      });
  }

  private showEditUserSpokenLanguages() {
    const modalSettings = this.defaultModalSettings;
    const modalRef = this._modalService.show(
      EditLanguageSpokenComponent,
      modalSettings
    );
    const modal: EditLanguageSpokenComponent = modalRef.content;
    modal.save.subscribe((result: boolean) => {
      if (result) {
        this.getUserSpokenLanguage();
      }
    });
  }
}
