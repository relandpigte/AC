import { ChangeDetectorRef, Component, ElementRef, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  GetProfileDetailDto,
  UserProfilesServiceProxy,
  FileParameter,
  AddressLookupServiceProxy,
  SuggestionDataDto,
  TimezoneInfoDto,
  TimezonesServiceProxy
} from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { countries } from '@shared/constants/countries';
import { uiEvents } from '@shared/constants/ui-events';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/ngx-bootstrap-typeahead';
import { fileUploadConfiguration } from '@shared/constants/configurations/file-upload.configuration';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AbstractControl, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppSessionService } from '@shared/session/app-session.service';
import { GoogleMapsService } from '@shared/services/google-maps.service';

@Component({
  selector: 'account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.less']
})
export class AccountDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('profileDetailForm') public form: NgForm;
  @ViewChild('profilePictureInput', { static: true }) profilePictureInput: ElementRef;

  userId: number;
  model: GetProfileDetailDto = new GetProfileDetailDto();
  datePickerConfig: BsDatepickerConfig;
  countries = countries;
  dateOfBirth: Date;
  profilePicture: FileParameter;
  profilePicturePlaceholderText: string;
  fileUploadSettings = fileUploadConfiguration;
  isLoading = false;
  isFullAddressRequired = false;
  isStudent = false;
  addressDataSource: Observable<SuggestionDataDto[]>;
  profilePictureUrl: string;
  timezones: TimezoneInfoDto[] = [];

  constructor(
    injector: Injector,
    private _timezonesService: TimezonesServiceProxy,
    private _userProfilesService: UserProfilesServiceProxy,
    private _addressLookupService: AddressLookupServiceProxy,
    private _sessionService: AppSessionService,
    private _googleMapsService: GoogleMapsService,
    private _cdRef: ChangeDetectorRef
  ) {
    super(injector);
    this.userId = this.appSession.userId;
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.profilePicturePlaceholderText = this.imageUploadPlaceholderText;
    this.isStudent = this.appSession.user.roles.includes('Student');
  }

  ngOnInit(): void {
    this.getDetails();
    this.getAddressLookup();
    this.getTimezonesList();
  }

  onAddressSelected(e: TypeaheadMatch): void {
    this.getAddressDetails(e.item.id);
  }

  onCountryChange(): void {
    this.setRequiredFields();
  }

  onFileChange(files: FileList): void {
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
          this.profilePictureUrl = reader.result.toString();
        };
        this.profilePicturePlaceholderText = file.name;
        this.profilePicture = {
          fileName: file.name,
          data: file
        };
      } else {
        this.clearUploader();
      }
    }
  }

  onFormSubmit(): void {
    const addresses = [];
    this.pushIfNotEmpty(addresses, this.model.zipOrPostCode);
    this.pushIfNotEmpty(addresses, this.model.city);
    this.pushIfNotEmpty(addresses, this.model.country);
    const address = addresses.join(',');
    this._googleMapsService.geocoder.geocode({ address }, (results, status) => {
      const place = results[0];
      if (place) {
        const location = place.geometry.location;
        this.model.longitude = location.lng();
        this.model.latitude = location.lat();
        if (this.model.longitude && this.model.latitude) {
          this.saveDetails();
          return;
        }
      }
      if (!this.isStudent) {
        this.message.error(this.l('LocationNotFoundErrorMessage'), this.l('LocationNotFoundErrortitle'));
      } else {
        this.saveDetails();
      }
    });
  }

  private getAddressLookup(): void {
    this.addressDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.model.addressLine1);
    }).pipe(
      switchMap((query: string) => {
        return this._addressLookupService.getAddress(query);
      })
    );
  }

  private getAddressDetails(id: string): void {
    this._addressLookupService.getAddressDetail(id).subscribe(result => {
      if (result) {
        this.model.addressLine1 = result.line_1;
        this.model.addressLine2 = result.line_2;
        this.model.city = result.town_Or_City;
        this.model.zipOrPostCode = result.postcode;
        this.model.stateOrProvince = result.county;
      }
    });
  }

  private setRequiredFields(): void {
    const strictCountries = ['United States', 'United Kingdom'];
    if (!this.isStudent) {
      setTimeout(() => {
        this.setControlValidators(this.form.controls.DateOfBirth, [Validators.required]);
        this.setControlValidators(this.form.controls.Country, [Validators.required]);
        this.setControlValidators(this.form.controls.AddressLine1, [Validators.required]);
        this.setControlValidators(this.form.controls.City, [Validators.required]);
      });
    } else {
      setTimeout(() => {
        this.clearControlValidators(this.form.controls.DateOfBirth);
        this.clearControlValidators(this.form.controls.Country);
        this.clearControlValidators(this.form.controls.AddressLine1);
        this.clearControlValidators(this.form.controls.City);
      });
    }

    if (strictCountries.includes(this.model.country)) {
      setTimeout(() => {
        this.setControlValidators(this.form.controls.ZipOrPostCode, [Validators.required]);
        if (!this.isStudent) {
          this.setControlValidators(this.form.controls.StateOrProvince, [Validators.required]);
        }
        this.isFullAddressRequired = true;
      });
    } else {
      setTimeout(() => {
        this.clearControlValidators(this.form.controls.ZipOrPostCode);
        if (!this.isStudent) {
          this.clearControlValidators(this.form.controls.StateOrProvince);
        }
        this.isFullAddressRequired = false;
      });
    }
  }

  private getDetails(): void {
    this.isLoading = true;
    this._userProfilesService.getDetail(this._sessionService.userId).subscribe(profileDetail => {
      this.model = profileDetail;
      if (this.model.dateOfBirth) {
        this.dateOfBirth = this.model.dateOfBirth.toDate();
      }
      if (this.model.profilePictureFileName) {
        this.profilePictureUrl = this.getProfilePicture(this.model.profilePictureFileName, this.model.userId);
      }
      this.setRequiredFields();
      this.isLoading = false;
      this._cdRef.detectChanges();
    });
  }

  private saveDetails(): void {
    this.isLoading = true;
    this._cdRef.detectChanges();
    if (this.dateOfBirth) {
      this.model.dateOfBirth = moment.utc(moment(this.dateOfBirth).format('YYYY-MM-DD'));
    }
    this._userProfilesService
      .saveDetail(
        this.model.firstName,
        this.model.lastName,
        this.model.dateOfBirth,
        this.model.addressLine1,
        this.model.addressLine2,
        this.model.city,
        this.model.zipOrPostCode,
        this.model.stateOrProvince,
        this.model.country,
        this.model.longitude,
        this.model.latitude,
        this.model.about,
        this.model.timezoneId,
        this.profilePicture
      )
      .subscribe(() => {
        this.clearUploader();
        this.notify.info(this.l('SavedSuccessfully'));
        abp.event.trigger(uiEvents.profileDetailsUpdated, this.model, this.profilePictureUrl);
        this.form.form.markAsPristine();
        this.getDetails();
      });
  }

  private setControlValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    if (control) {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  private clearControlValidators(control: AbstractControl): void {
    if (control) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  private validateFile(file: File): boolean {
    const invalidUploadMessageTitle = this.l('InvalidFileUploadErrorTitle');

    if (!this.validateFileExtension(file)) {
      this.message.error(this.l('InvalidFileExtensionUploadError'), invalidUploadMessageTitle, true);
      return false;
    }

    if (!this.validateFileSize(file.size, this.fileUploadSettings.profilePictureMaxFileSize)) {
      this.message.error(this.l('ProfilePictureFileSizeUploadError'), invalidUploadMessageTitle, true);
      return false;
    }

    return true;
  }

  private validateFileExtension(file: File): boolean {
    const fileExtension = this.getFileExtension(file.name).toLocaleLowerCase();
    const index = this.fileUploadSettings.allowedExtensions.indexOf(`.${fileExtension}`);
    return index >= 0;
  }

  private validateFileSize(size: number, maxLimit: number) {
    return size <= maxLimit;
  }

  private getFileExtension(fileName: string): string {
    const fileNameArray = fileName.split('.');
    return fileNameArray[fileNameArray.length - 1];
  }

  private clearUploader(): void {
    this.profilePictureInput.nativeElement.value = '';
    this.profilePicturePlaceholderText = this.imageUploadPlaceholderText;
  }

  private pushIfNotEmpty(addresses: string[], address: string): void {
    if (address) {
      addresses.push(address);
    }
  }

  private getTimezonesList(): void {
    this._timezonesService.getTimezonesList().subscribe(timezones => {
      this.timezones = timezones;
    });
  }
}
