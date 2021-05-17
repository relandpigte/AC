import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { countries } from '@shared/constants/countries';
import { PaymentsServiceProxy, ProfilesServiceProxy, TimeZoneDto, TimeZonesServiceProxy, UserDto, UserLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { environment } from 'environments/environment';
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
  isOnboarding = true;
  isTutorProfile = false;

  constructor(
    injector: Injector,
    private _timeZonesService: TimeZonesServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _paymentsService: PaymentsServiceProxy,
    private _route: ActivatedRoute,
    private _router: Router,
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
    this._route.queryParams.subscribe(paramMap => {
      if (paramMap.scope && paramMap.code) {
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

  onConnectStripeClick(): void {
    this.message.confirm(
      this.l('StripeOnboardingConfirmationMessage'),
      undefined,
      (result: boolean) => {
        if (result) {
          window.location.href = environment.providers.stripe.onbloardLink(environment.providers.stripe.clientId, AppConsts.appBaseUrl);
        } else {
          this.isTutorProfile = false;
        }
      }
    );
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
