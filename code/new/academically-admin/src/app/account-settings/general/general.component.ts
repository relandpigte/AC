import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { countries } from '@shared/constants/countries';
import { ProfilesServiceProxy, TimeZoneDto, TimeZonesServiceProxy, UserDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ChangeData, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less']
})
export class GeneralComponent extends AppComponentBase implements OnInit {
  user: UserLoginInfoDto;
  model: UserDto = new UserDto();
  dateOfBirth: Date;
  datePickerConfig: BsDatepickerConfig;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  countries = countries;
  timezones: TimeZoneDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _timeZonesService: TimeZonesServiceProxy,
    private _profilesService: ProfilesServiceProxy,
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
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this.model.phoneNumber = (this.model.phoneNumber as ChangeData).internationalNumber;
    this._profilesService.update(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
      });
  }

  private getUser(): void {
    this.isLoading = true;
    this._profilesService.get(this.appSession.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(user => {
        this.model = user;
        if (this.model.phoneNumber) {
          this.model.phoneNumber = this.model.phoneNumber.substr(this.model.phoneNumber.indexOf(' ') + 1);
        }
        if (this.model.dateOfBirth) {
          this.dateOfBirth = this.model.dateOfBirth.toDate();
        }
      })
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
        this.timezones = timezones;
      });
  }
}
