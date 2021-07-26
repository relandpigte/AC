import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  SpokenLanguageProficiency,
  UserSpokenLanguageDto,
  UserSpokenlanguageServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EditSpokenLanguageModalComponent } from './edit-spoken-languages-modal/edit-spoken-languages-modal.component';

@Component({
  selector: 'app-spoken-languages',
  templateUrl: './spoken-languages.component.html',
  styleUrls: ['./spoken-languages.component.less'],
})
export class SpokenLanguagesComponent extends AppComponentBase implements OnInit {
  @Input() userId = this.appSession.userId;
  @Input() isViewOnly = false;
  userSpokenLanguages: UserSpokenLanguageDto[] = [];
  isLoading = false;
  SpokenLanguageProficiency = SpokenLanguageProficiency;

  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _userSpokenlanguageServiceProxy: UserSpokenlanguageServiceProxy
  ) {
    super(injector);
  }

  get canCreate(): boolean {
    return this.isGranted('Pages.TutorWizard.Languages.Create') ||
      this.isGranted('Pages.Profile.LanguageSpoken.Create');
  }

  ngOnInit(): void {
    this.getUserSpokenLanguage();
  }

  onEdit(): void {
    this.showEditUserSpokenLanguages();
  }

  private getUserSpokenLanguage(): void {
    this.isLoading = true;
    this._userSpokenlanguageServiceProxy
      .getUserSpokenLanguages(this.userId)
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
