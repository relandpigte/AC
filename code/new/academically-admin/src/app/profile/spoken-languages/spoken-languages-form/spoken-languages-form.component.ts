import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ProfileService } from "@app/profile/_services/profile.service";
import { AppComponentBase } from "@shared/app-component-base";
import {
  EditOtherUserSpokenLanguageDto,
  EditUserSpokenLanguagesDto,
  SpokenLanguageDto,
  SpokenLanguagesServiceProxy,
  UserDto,
  UserSpokenLanguageDto,
  UserSpokenlanguageServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import * as _ from "lodash-es";
import { BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { EditOtherSpokenLanguagesComponent } from "../edit-other-spoken-languages/edit-other-spoken-languages.component";

@Component({
  selector: "app-spoken-languages-form",
  templateUrl: "./spoken-languages-form.component.html",
  styleUrls: ["./spoken-languages-form.component.less"],
})
export class SpokenLanguagesFormComponent
  extends AppComponentBase
  implements OnInit {
  @ViewChild('form', { read: NgForm }) form: any;
  @Output() save = new EventEmitter<boolean>();
  @Output() isLoadingChange = new EventEmitter<boolean>();

  userSpokenLanguages: UserSpokenLanguageDto[];
  otherUserSpokenLanguages: UserSpokenLanguageDto[];
  spokenLanguages: SpokenLanguageDto[];
  otherSpokenLanguages: SpokenLanguageDto[];
  isLoading = true;
  englishProficiency = 0;
  unSelectedSpokenLanguages: SpokenLanguageDto[];
  proficiency = [
    {
      id: 0,
      text: "Basic",
    },
    {
      id: 1,
      text: "Conversational",
    },
    {
      id: 2,
      text: "Fluent",
    },
    {
      id: 3,
      text: "NativeOrBilingual",
    },
  ];
  constructor(
    injector: Injector,
    private _appSession: AppSessionService,
    private _modalService: BsModalService,
    private _spokenlanguageServiceProxy: SpokenLanguagesServiceProxy,
    private _userSpokenlanguageServiceProxy: UserSpokenlanguageServiceProxy
  ) {
    super(injector);
    this.getUserSpokenLanguage();
    this.getSpokenLanugages();
  }

  ngOnInit(): void { }

  onFormSubmit(): void {
    this.setIsLoading(true);
    const formModel = new EditUserSpokenLanguagesDto();
    formModel.userId = this._appSession.user.id;
    formModel.englishProficiency = this.englishProficiency;
    formModel.otherUserSpokenLanguages = [];

    this.otherUserSpokenLanguages.forEach((e) => {
      let otherUserSpokenLanguage = new EditOtherUserSpokenLanguageDto();
      otherUserSpokenLanguage.spokenLanguageId = e.spokenLanguageId;
      otherUserSpokenLanguage.proficiency = e.proficiency;
      formModel.otherUserSpokenLanguages.push(otherUserSpokenLanguage);
    });

    this._userSpokenlanguageServiceProxy
      .editUserSpokenLanguages(formModel)
      .pipe(
        finalize(() => {
          this.setIsLoading(false);
        })
      )
      .subscribe(() => {
        this.notify.success(this.l("SavedSuccessfully"));
        this.save.emit(true);
      });
  }

  onRemoveOtherLanguage(id: string): void {
    this.otherUserSpokenLanguages = this.otherUserSpokenLanguages.filter(
      (s) => {
        return s.id !== id;
      }
    );
    this.unSelectedSpokenLanguages = this.getUnselectedOtherLanguages();
  }

  onAddOtherLanguage(): void {
    this.showAddEditOtherUserSpokenLanguages(null);
  }

  onEditOtherLanguage(id: string): void {
    const toEditOtherUserSpokenLanguage = this.otherUserSpokenLanguages.find(
      (s) => {
        return s.id == id;
      }
    );

    this.showAddEditOtherUserSpokenLanguages(
      _.cloneDeep(toEditOtherUserSpokenLanguage)
    );
  }

  getUnselectedOtherLanguages(): SpokenLanguageDto[] {
    if (!this.otherUserSpokenLanguages || !this.spokenLanguages) return [];

    const selectedSpokenLanguagesId = this.otherUserSpokenLanguages.map(
      ({ spokenLanguageId }) => spokenLanguageId
    );

    return this.otherSpokenLanguages.filter((x) => {
      return !selectedSpokenLanguagesId.includes(x.id);
    });
  }

  getProficiencyText(id: number): string {
    const languageProficiency = this.proficiency.filter((s) => {
      return s.id == id;
    });
    return languageProficiency.length > 0 ? languageProficiency[0].text : "";
  }

  private showAddEditOtherUserSpokenLanguages(
    userSpokenLanguage: UserSpokenLanguageDto
  ) {
    this.unSelectedSpokenLanguages = this.getUnselectedOtherLanguages();

    if (!userSpokenLanguage) {
      userSpokenLanguage = new UserSpokenLanguageDto();
    } else {
      var spokenEditlanguage = this.spokenLanguages.find((s) => {
        return s.id == userSpokenLanguage.spokenLanguageId;
      });

      this.unSelectedSpokenLanguages.push(spokenEditlanguage);

      this.unSelectedSpokenLanguages = this.unSelectedSpokenLanguages.sort(
        (a, b) => {
          return a.name.localeCompare(b.name);
        }
      );
    }

    const modalSettings = this.defaultModalSettings as ModalOptions<EditOtherSpokenLanguagesComponent>;
    modalSettings.initialState = {
      unSelectedSpokenLanguages: this.unSelectedSpokenLanguages,
      editUserSpokenLanguage: userSpokenLanguage,
    };
    modalSettings.class = "modal-sm";
    const modalRef = this._modalService.show(
      EditOtherSpokenLanguagesComponent,
      modalSettings
    );
    const modal: EditOtherSpokenLanguagesComponent = modalRef.content;
    modal.save.subscribe((result: UserSpokenLanguageDto) => {
      if (result) {
        this.pushNewUpdatedOtherUserSpokenLanguage(result);
      }
    });
  }

  private pushNewUpdatedOtherUserSpokenLanguage(
    userSpokenLanguage: UserSpokenLanguageDto
  ) {
    const index = this.otherUserSpokenLanguages.findIndex(
      (e) => e.id === userSpokenLanguage.id
    );

    userSpokenLanguage.spokenLanguageName = this.spokenLanguages.find((s) => {
      return s.id == userSpokenLanguage.spokenLanguageId;
    }).name;

    if (index > -1) {
      this.otherUserSpokenLanguages[index].id = userSpokenLanguage.id;
      this.otherUserSpokenLanguages[index].spokenLanguageId =
        userSpokenLanguage.spokenLanguageId;
      this.otherUserSpokenLanguages[index].proficiency =
        userSpokenLanguage.proficiency;
    } else {
      this.otherUserSpokenLanguages.push(userSpokenLanguage);
    }

    this.unSelectedSpokenLanguages = this.getUnselectedOtherLanguages();
  }

  private getOtherSpokenLanguages(): SpokenLanguageDto[] {
    return this.spokenLanguages.filter((x) => {
      return x.name.toLowerCase() !== "english";
    });
  }

  private getOtherUserSpokenLanguages(): UserSpokenLanguageDto[] {
    return this.userSpokenLanguages.filter((x) => {
      return x.spokenLanguageName.toLowerCase() !== "english";
    });
  }

  private getSpokenLanugages(): void {
    this.setIsLoading(true);
    this._spokenlanguageServiceProxy.get().subscribe((result) => {
      this.spokenLanguages = result;
      this.otherSpokenLanguages = this.getOtherSpokenLanguages();
      this.unSelectedSpokenLanguages = this.getUnselectedOtherLanguages();
      this.setIsLoading(false);
    });
  }

  private setIsLoading(value: boolean) {
    this.isLoading = value;
    this.isLoadingChange.emit(value);
  }

  private getUserSpokenLanguage(): void {
    this.setIsLoading(true);
    this._userSpokenlanguageServiceProxy
      .getUserSpokenLanguages(this._appSession.user.id)
      .subscribe((result) => {
        this.userSpokenLanguages = result;
        this.otherUserSpokenLanguages = this.getOtherUserSpokenLanguages();
        this.setEnglishProficiency();
        this.unSelectedSpokenLanguages = this.getUnselectedOtherLanguages();
        this.setIsLoading(false);
      });
  }

  private setEnglishProficiency(): void {
    const englishSpoken = this.userSpokenLanguages.filter((x) => {
      return x.spokenLanguageName.toLowerCase() == "english";
    });

    if (englishSpoken.length > 0) {
      this.englishProficiency = englishSpoken[0].proficiency;
    }
  }
}
