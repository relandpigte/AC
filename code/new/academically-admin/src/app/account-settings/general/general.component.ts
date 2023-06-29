import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { countries } from '@shared/constants/countries';
import {
  LocationSuggestion,
  PaymentsServiceProxy,
  ProfilesServiceProxy,
  TimeZoneDto,
  TimeZonesServiceProxy,
  UserDto,
  UserLoginInfoDto,
} from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ChangeData, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Observer } from 'rxjs';
import { Observable } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { take } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less']
})
export class GeneralComponent extends AppComponentBase implements OnInit {
  @ViewChild('createEditForm') public form: NgForm;
  user: UserLoginInfoDto;
  model: UserDto = new UserDto();
  locationsDataSource: Observable<LocationSuggestion[]>;
  dateOfBirth: Date;
  datePickerConfig: BsDatepickerConfig;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  countries = countries;
  timeZones: TimeZoneDto[] = [];
  currentTimeZone: string;
  isLoading = false;
  isOnboarding = true;
  isTutorProfile = false;
  isFullAddressRequired = false;
  phoneNumber: ChangeData = {
    countryCode: CountryISO.UnitedKingdom,
  };
  emailCustomValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'emailTaken',
      localizationKey: 'EmailTakenValidationError',
    },
  ];

  constructor(
    injector: Injector,
    private _timeZonesService: TimeZonesServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _paymentsService: PaymentsServiceProxy,
    private _route: ActivatedRoute,
    private _router: Router,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
    this.user = this.appSession.user;
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.getTimeZones();
    this.getUser();
    this.getLocationSuggestions();
    this._route.queryParams.subscribe(paramMap => {
      if (paramMap.code) {
        this._paymentsService.onboardUser(paramMap.code)
          .pipe(
            takeUntil(this.destroyed$),
            finalize(() => {
              this.isOnboarding = false;
            }),
          )
          .subscribe(() => {
            this.notify.success(this.l('StripeOnboardingSuccessMessage'));
            this.getUser();
            this._router.navigate(['/app/account-settings/general']);
          });
      } else {
        this.isOnboarding = false;
      }
    });
  }

  onFormSubmit(): void {
    this.model.phoneNumber = JSON.stringify(this.phoneNumber);
    this.isLoading = true;
    if (this.dateOfBirth) {
      this.model.dateOfBirth = moment(this.convertDateToMoment(this.dateOfBirth).format('YYYY-MM-DD'));
    }
    this._profilesService.update(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
          if (this.currentTimeZone !== this.model.timeZoneId) {
            this.currentTimeZone = this.model.timeZoneId;
            const timeZone = this.timeZones.find(e => e.id === this.model.timeZoneId);
            abp.timing.timeZoneInfo.iana.timeZoneId = timeZone.ianaName;
            moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
          }
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  onConnectStripeClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('StripeOnboardingConfirmationMessage'),
      confirmCb: (): void => {
        window.location.href = environment.providers.stripe.onbloardLink(environment.providers.stripe.clientId, AppConsts.appBaseUrl);
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }

  onCountryChange(): void {
    this.setRequiredFields();
  }

  onAddressSelected(e: TypeaheadMatch): void {
    this.getLocationDetail(e.item.id);
  }

  private getUser(): void {
    this.isLoading = true;
    this._profilesService.get(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.setRequiredFields();
          this.isLoading = false;
        }),
      )
      .subscribe(user => {
        this.model = user;
        this.currentTimeZone = this.model.timeZoneId;
        if (this.model.phoneNumber) {
          this.phoneNumber = JSON.parse(this.model.phoneNumber) as ChangeData;
        }
        if (this.model.dateOfBirth) {
          this.dateOfBirth = this.model.dateOfBirth.toDate();
        }
      });
  }

  private getTimeZones(): void {
    this.isLoading = true;
    this._timeZonesService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(timezones => {
        this.timeZones = timezones;
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

  private getLocationSuggestions(): void {
    this.locationsDataSource = new Observable((observer: Observer<string>) => {
      observer.next(this.model.addressLine1);
    }).pipe(
      takeUntil(this.destroyed$),
      switchMap((query: string) => {
        return this._profilesService.getLocationSuggestions(query);
      })
    );
  }

  private getLocationDetail(id: string): void {
    this.isLoading = true;
    this._profilesService.getLocation(id)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(result => {
        if (result) {
          this.model.addressLine1 = result.line_1;
          this.model.addressLine2 = result.line_2;
          this.model.city = result.town_Or_City;
          this.model.zipOrPostCode = result.postcode;
          this.model.stateOrProvince = result.county;
        }
      });
  }
}
