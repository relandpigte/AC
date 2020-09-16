import { Component, ElementRef, inject, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetProfileDetailDto, UserProfilesServiceProxy, FileParameter } from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { countries } from '@shared/constants/countries';
import { uiEvents } from '@shared/constants/ui-events';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AbstractControl, NgForm, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.less']
})
export class ProfileDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('profileDetailForm') profileDetailForm: NgForm;
  @ViewChild('profilePictureInput', { static: true }) profilePictureInput: ElementRef;

  userId: number;
  model: GetProfileDetailDto = new GetProfileDetailDto;
  datePickerConfig: BsDatepickerConfig;
  countries = countries;
  dateOfBirth: Date;
  profilePicture: FileParameter;
  profilePicturePlaceholderText: string;
  fileUploadSettings = fileUploadConfiguration;
  isLoading = false;
  isFullAddressRequired = false;

  constructor(
    injector: Injector,
    private _userProfilesService: UserProfilesServiceProxy,
  ) {
    super(injector);
    this.userId = this.appSession.userId;
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.profilePicturePlaceholderText = this.imageUploadPlaceholderText;
  }

  ngOnInit(): void {
    this.getDetails();
  }

  onCountryChange(): void {
    const strictCountries = ['United States', 'United Kingdom'];
    if (strictCountries.includes(this.model.country)) {
      setTimeout(() => {
        this.setControlValidators(this.profileDetailForm.controls.ZipOrPostCode, [Validators.required]);
        this.setControlValidators(this.profileDetailForm.controls.StateOrProvince, [Validators.required]);
        this.isFullAddressRequired = true;
      });
    } else {
      setTimeout(() => {
        this.clearControlValidators(this.profileDetailForm.controls.ZipOrPostCode);
        this.clearControlValidators(this.profileDetailForm.controls.StateOrProvince);
        this.isFullAddressRequired = false;
      });
    }
  }

  onFileChange(files: FileList): void {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.model.profilePictureUrl = reader.result.toString();
      };
      this.profilePicturePlaceholderText = file.name;
      this.profilePicture = {
        fileName: file.name,
        data: file
      };
    }
  }

  onFormSubmit(): void {
    this.saveDetails();
  }

  private getDetails(): void {
    this.isLoading = true;
    this._userProfilesService.getDetail()
      .subscribe(profileDetail => {
        this.model = profileDetail;
        if (this.model.dateOfBirth) {
          this.dateOfBirth = this.model.dateOfBirth.toDate();
        }
        this.isLoading = false;
      });
  }

  private saveDetails(): void {
    this.isLoading = true;
    this.model.dateOfBirth = moment(moment(this.dateOfBirth).format('YYYY-MM-DD'));
    const blob = new Blob([JSON.stringify(this.model)]);
    this._userProfilesService.saveDetail(this.model.firstName, this.model.lastName,
      this.model.dateOfBirth, this.model.addressLine1, this.model.addressLine2, this.model.city, this.model.zipOrPostCode,
      this.model.stateOrProvince, this.model.country, this.profilePicture)
      .subscribe(() => {
        this.profilePictureInput.nativeElement.value = '';
        this.profilePicturePlaceholderText = this.imageUploadPlaceholderText;
        this.notify.info(this.l('SavedSuccessfully'));
        abp.event.trigger(uiEvents.profileDetailsUpdated, this.model);
        this.isLoading = false;
      });
  }

  private setControlValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  private clearControlValidators(control: AbstractControl): void {
    control.clearValidators();
    control.updateValueAndValidity();
  }
}
