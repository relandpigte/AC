import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DeclineTutorVerificationStepDto, TutorVerificationStepDto, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tutor-wizard-step-declined',
  templateUrl: './tutor-wizard-step-declined.component.html',
  styleUrls: ['./tutor-wizard-step-declined.component.less']
})
export class TutorWizardStepDeclinedComponent extends AppComponentBase implements OnInit  {
  @Input() model: TutorVerificationStepDto = new TutorVerificationStepDto();
  @Output() modelSaved = new EventEmitter();
  isSaving = false;
  reason: string;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _tutorWizardService: TutorWizardServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onFormSubmit(): void {

    const request = new DeclineTutorVerificationStepDto();
    request.comments = this.reason;
    request.tutorVerificationStepId = this.model.id;
    this.isSaving = true;
    this._tutorWizardService.decline(request)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe(() => {
        this.modelSaved.emit();
        this._modal.hide();
      });
  }
}
