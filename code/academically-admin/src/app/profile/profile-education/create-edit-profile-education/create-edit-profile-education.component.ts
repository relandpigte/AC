import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { countries } from '@shared/constants/countries';
import { EducationLevel, UserEducationDto, UserEducationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-edit-profile-education',
  templateUrl: './create-edit-profile-education.component.html',
  styleUrls: ['./create-edit-profile-education.component.less']
})
export class CreateEditProfileEducationComponent extends AppComponentBase implements OnInit {
  @Input() id: string;
  @Output() modalSave = new EventEmitter<any>();

  model: UserEducationDto = new UserEducationDto();
  countries = countries;
  yearSelections: number[] = [];
  educationLevels: number[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _modalRef: BsModalRef,
    private _userEducationsService: UserEducationsServiceProxy,
  ) {
    super(injector);
    for (let year = abp.clock.now().getFullYear(); year >= 1950; year--) {
      this.yearSelections.push(year);
    }
  }

  ngOnInit(): void {
    this.getEducationLevels();
    if (this.id) {
      this.getUserEducation();
    }
  }

  onStartYearChange(): void {
    if (+this.model.startYear > +this.model.endYear) {
      this.model.endYear = this.model.startYear;
    }
  }

  onEndYearChange(): void {
    if (+this.model.endYear < +this.model.startYear) {
      this.model.startYear = this.model.endYear;
    }
  }

  onCloseClick(): void {
    this.close();
  }

  onFormSubmit(): void {
    this.saveUserEducation();
  }

  private saveUserEducation(): void {
    this.isLoading = true;
    const saveSubscription = this.id ? this._userEducationsService.update(this.model) : this._userEducationsService.create(this.model);
    saveSubscription
      .pipe(finalize(() => {
        this.isLoading = false;
      })
      ).subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.isLoading = false;
        this.modalSave.emit();
        this.close();
      });
  }

  private getUserEducation(): void {
    this.isLoading = true;
    this._userEducationsService.get(this.id)
      .subscribe(userEducation => {
        this.model = userEducation;
        this.isLoading = false;
      });
  }

  private getEducationLevels(): void {
    this.educationLevels = this.enumToArray(EducationLevel).reverse();
  }

  private close(): void {
    this._modalRef.hide();
  }
}
