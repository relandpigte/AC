import { Component, OnInit, Input, Injector, Output, EventEmitter } from '@angular/core';
import { AcademicLevelDto, SuggestQualificationDto, UserEducationsServiceProxy, AcademicLevelQualificationDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { takeUntil, finalize } from 'rxjs/operators';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-suggest-qualification',
  templateUrl: './suggest-qualification.component.html',
  styleUrls: ['./suggest-qualification.component.less']
})
export class SuggestQualificationComponent extends AppComponentBase implements OnInit {
  @Input() academicLevel: AcademicLevelDto = new AcademicLevelDto();
  @Output() modelSaved = new EventEmitter<AcademicLevelQualificationDto>();

  model: SuggestQualificationDto = new SuggestQualificationDto();
  isLoading = false;

  constructor(
    injector: Injector,
    private _userEducationsService: UserEducationsServiceProxy,
    private _modal: BsModalRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.model.academicLevelId = this.academicLevel.id;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    this._userEducationsService.suggestionQualification(this.model)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(response => {
        this.modelSaved.emit(response);
        this.message.success(this.l('QualificationSuggestionSubmittedMessage'));
        this._modal.hide();
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
