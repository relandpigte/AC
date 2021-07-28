import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { RegistrationDto, RegistrationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  templateUrl: './register.component.html',
  animations: [accountModuleAnimation()]
})
export class RegisterComponent extends AppComponentBase {
  model: RegistrationDto = new RegistrationDto();
  saving = false;
  isTAndCAccepted = false;
  dateOfBirth: Date;
  datePickerConfig: BsDatepickerConfig;
  emailCustomValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'emailTaken',
      localizationKey: 'EmailTakenValidationError',
    },
  ];

  constructor(
    injector: Injector,
    private _registrationsService: RegistrationsServiceProxy,
    private _router: Router,
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  onFormSubmit(): void {
    this.saving = true;
    if (this.dateOfBirth) {
      this.model.dateOfBirth = moment.utc(moment(this.dateOfBirth).format('YYYY-MM-DD'));
    }
    this._registrationsService
      .create(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.message.success(this.l('RegistrationEmailSent'));
        this._router.navigate(['/account/login']);
        return;
      });
  }
}
