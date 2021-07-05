import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { countries } from '@shared/constants/countries';
import { BecomeATutorStep, LocationSuggestion, ProfilesServiceProxy, TutorWizardServiceProxy, UpdateAddressDto } from '@shared/service-proxies/service-proxies';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable, Observer } from 'rxjs';
import { takeUntil, switchMap, finalize } from 'rxjs/operators';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less']
})
export class AddressComponent extends AppComponentBase implements OnInit {
  @ViewChild('createEditForm') public form: NgForm;
  model: UpdateAddressDto = new UpdateAddressDto();
  locationsDataSource: Observable<LocationSuggestion[]>;
  countries = countries;
  isFullAddressRequired = false;
  isLoading = false;
  userId: number;
  isReadOnly = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _profilesService: ProfilesServiceProxy,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);

    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this.appSession.userId;
      this.isReadOnly = (this.userId !== this.appSession.userId);
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getLocationSuggestions();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._tutorWizardService.updateAddress(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateStep();
      });
  }

  onCountryChange(): void {
    this.setRequiredFields();
  }

  onAddressSelected(e: TypeaheadMatch): void {
    this.getLocationDetail(e.item.id);
  }


  onNavigateNextScreen(): void {
    this._router.navigate([`app/tutor-applications/${this.userId}/contact-number`]);
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/photo-id`]);
    } else {
      this._router.navigate([`app/tutor-wizard/photo-id`]);
    }
  }

  private getUser(): void {
    this.isLoading = true;
    this._profilesService.get(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.setRequiredFields();
          this.isLoading = false;
        }),
      )
      .subscribe(user => {
        this.model = user;
      });
  }

  private setRequiredFields(): void {
    const strictCountries = ['United States', 'United Kingdom'];

    if (strictCountries.includes(this.model.country)) {
      setTimeout(() => {
        this.setControlValidators(this.form.controls.ZipOrPostCode, [Validators.required]);
        this.setControlValidators(this.form.controls.StateOrProvince, [Validators.required]);
        this.isFullAddressRequired = true;
      });
    } else {
      setTimeout(() => {
        this.clearControlValidators(this.form.controls.ZipOrPostCode);
        this.clearControlValidators(this.form.controls.StateOrProvince);
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

  private updateStep(): void {
    const nextStep = BecomeATutorStep.ContactNumber;
    this._tutorWizardService.updateStep(nextStep)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((result) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._becomeATutorService.currentStep = nextStep;
        this._becomeATutorService.currentTutorWizardStep = result;
      });
  }
}
