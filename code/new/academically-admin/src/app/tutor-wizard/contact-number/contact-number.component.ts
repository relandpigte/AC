import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {
  BecomeATutorStep,
  PhoneVerificationsServiceProxy,
  ProfilesServiceProxy,
  TutorApplicationServiceProxy,
  TutorVerificationStepDto,
  TutorWizardServiceProxy,
  TutorVerificationStepStatus
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CountryISO, PhoneNumberFormat, SearchCountryField, ChangeData } from 'ngx-intl-tel-input';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize, takeUntil } from 'rxjs/operators';
import { TutorWizardStepDeclinedComponent } from '../_components/tutor-wizard-step-declined/tutor-wizard-step-declined.component';
import { BecomeATutorService } from '../_services/become-a-tutor.service';

enum PhoneVerificationState {
  NotSent,
  Sent,
  EditSent,
  Verified,
}

@Component({
  selector: 'app-contact-number',
  templateUrl: './contact-number.component.html',
  styleUrls: ['./contact-number.component.less']
})
export class ContactNumberComponent extends AppComponentBase implements OnInit, OnDestroy {
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  PhoneVerificationState = PhoneVerificationState;
  phoneNumber: ChangeData;
  verificationCode: string;
  isLoading = false;
  isSending = false;
  defaultResendTimerValue = 60;
  resendTimer: number;
  resendTimerSubscription: Subscription;
  currentState = PhoneVerificationState.NotSent;
  userId: number;
  isReadOnly = false;

  userPhoneNumber = '';
  tutorVerificationStep: TutorVerificationStepDto;
  isDeclining = false;
  isApproving = false;
  tutorVerificationStepStatus = TutorVerificationStepStatus;
  tutorVerificationPrevStep: TutorVerificationStepDto;
  tutorVerificationNextStep: TutorVerificationStepDto;

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _tutorApplicationService: TutorApplicationServiceProxy,
    private _phoneVerificationsService: PhoneVerificationsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this._becomeATutorService.userId$.subscribe(userId => {
      this.userId = userId ?? this.appSession.userId;
      this.isReadOnly = (this.userId !== this.appSession.userId);
      this.getUser();
    });
    this._becomeATutorService.currentTutorWizardStep$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(step => {
        this.tutorVerificationStep = step;
        if (this.isReadOnly && this.tutorVerificationStep.step !== BecomeATutorStep.ContactNumber) {
          this._tutorApplicationService.getStep(step.tutorVerificationId, BecomeATutorStep.ContactNumber).subscribe(result => {
            this.tutorVerificationStep = result;
          });
        }
        if (this.isReadOnly) {
          this._tutorApplicationService.getPreviousStep(step.tutorVerificationId, BecomeATutorStep.ContactNumber).subscribe(result => {
            this.tutorVerificationPrevStep = result;
          });

          this._tutorApplicationService.getNextStep(step.tutorVerificationId, BecomeATutorStep.ContactNumber).subscribe(result => {
            this.tutorVerificationNextStep = result;
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.resendTimerSubscription) {
      this.resendTimerSubscription.unsubscribe();
    }
  }

  onNavigateNextScreen(): void {
    if (this.tutorVerificationNextStep?.status === TutorVerificationStepStatus.Saved) {
      this._router.navigate([`app/tutor-applications/${this.userId}/references`]);
    }
  }

  onStatusChange(event: any): void {
    const isApproved = event.target.value === 'approved';
    if (isApproved) {
      this.isApproving = true;
      this._tutorWizardService.approve(this.tutorVerificationStep.id)
        .subscribe(() => {
          this.getPendingStep();
        });
    } else {
      event.preventDefault();
      this.showDeclinedModal(this.tutorVerificationStep);
    }
  }

  onBackClick(): void {
    if (this.isReadOnly) {
      this._router.navigate([`app/tutor-applications/${this.userId}/address`]);
    } else {
      this._router.navigate([`app/tutor-wizard/address`]);
    }
  }

  onSendClick(): void {
    this.isLoading = true;
    this.isSending = true;
    this._phoneVerificationsService.create(JSON.stringify(this.phoneNumber))
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isSending = true;
      }))
      .subscribe(() => {
        if (this.currentState === PhoneVerificationState.EditSent) {
          this.resendTimer = this.defaultResendTimerValue;
          this.initiateResendTimer();
        }
        this.currentState = PhoneVerificationState.Sent;
        this.notify.success(this.l('PhoneNumberVerificationSentMessage'));
      });
  }

  onVerifyClick(): void {
    if (this.currentState === PhoneVerificationState.Verified) {
      this.updateStep();
    } else {
      this.isLoading = true;
      this._phoneVerificationsService.verify(this.verificationCode)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => {
            this.isLoading = false;
          }),
        )
        .subscribe(() => {
          this.currentState = PhoneVerificationState.Verified;
          this.updateStep();
        });
    }
  }

  onResendClick(): void {
    this.isLoading = true;
    this._phoneVerificationsService.create(JSON.stringify(this.phoneNumber))
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.currentState = PhoneVerificationState.Sent;
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.resendTimer = this.defaultResendTimerValue;
        this.initiateResendTimer();
        this.notify.success(this.l('PhoneNumberVerificationSentMessage'));
      });
  }

  onEditPhoneNumberClick(): void {
    if (this.currentState === PhoneVerificationState.Verified) {
      this.message.confirm(
        undefined,
        this.l('ReverifiyPhoneNumberConfirmationMessage'),
        (result: boolean) => {
          if (result) {
            delete this.phoneNumber;
            this.currentState = PhoneVerificationState.EditSent;
          }
        }
      );
    } else {
      this.currentState = PhoneVerificationState.EditSent;
    }
  }

  private initiateResendTimer(): void {
    this.resendTimerSubscription = interval(1000).subscribe(() => {
      if (this.resendTimer > 1) {
        this.resendTimer--;
      } else {
        this.resendTimer = 0;
        this.resendTimerSubscription.unsubscribe();
        this.currentState = PhoneVerificationState.Sent;
      }
    });
  }

  private getLatestUnverifiedVerification(): void {
    this._phoneVerificationsService.getLastUnverified()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(phoneVerification => {
        if (this.currentState !== PhoneVerificationState.Verified && phoneVerification && phoneVerification.id) {
          this.phoneNumber = JSON.parse(phoneVerification.recipient);
          this.currentState = PhoneVerificationState.Sent;
          const resendTimer = this.diffMomentDatesSeconds(
            phoneVerification.dateSent.add(this.defaultResendTimerValue, 'seconds'),
            moment()
          );
          if (resendTimer > 0) {
            this.resendTimer = resendTimer;
            this.initiateResendTimer();
          }
        }
      });
  }

  private getUser(): void {
    this.isLoading = true;
    this._profilesService.get(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(user => {
        if (user.isPhoneNumberConfirmed) {
          this.currentState = PhoneVerificationState.Verified;
          if (user.phoneNumber) {
            this.userPhoneNumber = user.phoneNumber;
            this.phoneNumber = JSON.parse(user.phoneNumber);
          }
        }
        this.getLatestUnverifiedVerification();
      });
  }

  private updateStep(): void {
    this._tutorWizardService.updateStep(BecomeATutorStep.ContactNumber)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.updateNextStep();
      });
  }

  private updateNextStep(): void {
    const nextStep = BecomeATutorStep.References;
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

  private getPendingStep(): void {
    this._tutorWizardService.getPendingStep(this.userId)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => this.isApproving = false)
      )
      .subscribe(result => {
        this._becomeATutorService.currentStep = result.step;
        this._becomeATutorService.currentTutorWizardStep = result;
        this.onNavigateNextScreen();
      });
  }

  private showDeclinedModal(model: TutorVerificationStepDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<TutorWizardStepDeclinedComponent>;
    modalSettings.initialState = {
      model: model,
    };
    const modal = this._modalService.show(TutorWizardStepDeclinedComponent, modalSettings).content;
    modal.modelSaved
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        this.getPendingStep();
      });
  }
}
