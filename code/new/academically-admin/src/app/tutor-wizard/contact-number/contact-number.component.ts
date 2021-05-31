import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BecomeATutorStep, PhoneVerificationsServiceProxy, ProfilesServiceProxy, TutorWizardServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { finalize, takeUntil } from 'rxjs/operators';
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
export class ContactNumberComponent extends AppComponentBase implements OnInit {
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  PhoneVerificationState = PhoneVerificationState;
  phoneNumber: any;
  verificationCode: string;
  isLoading = false;
  isSending = false;
  defaultResendTimerValue = 60;
  resendTimer: number;
  resendTimerSubscription: Subscription;
  currentState = PhoneVerificationState.NotSent;

  constructor(
    injector: Injector,
    private _phoneVerificationsService: PhoneVerificationsServiceProxy,
    private _profilesService: ProfilesServiceProxy,
    private _tutorWizardService: TutorWizardServiceProxy,
    private _becomeATutorService: BecomeATutorService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    if (this.resendTimerSubscription) {
      this.resendTimerSubscription.unsubscribe();
    }
  }

  onSendClick(): void {
    this.isLoading = true;
    this.isSending = true;
    this._phoneVerificationsService.create(this.phoneNumber.internationalNumber)
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
        this.phoneNumber = this.formatPhoneNumber(this.phoneNumber.internationalNumber);
        this.notify.success(this.l('PhoneNumberVerificationSentMessage'));
      });
  }

  onVerifyClick(): void {
    if (this.currentState === PhoneVerificationState.Verified) {
      this.updateStep();
    } else {
      this.isLoading = true;
      this._phoneVerificationsService.verify(this.verificationCode)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.currentState = PhoneVerificationState.Verified;
          this.updateStep();
        });
    }
  }

  onResendClick(): void {
    this.isLoading = true;
    const phoneNumber = this.phoneNumber.internationalNumber ? this.phoneNumber.internationalNumber : this.phoneNumber;
    this._phoneVerificationsService.create(phoneNumber)
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
          this.phoneNumber = this.formatPhoneNumber(phoneVerification.recipient);
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
    this._profilesService.get(this.appSession.userId)
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
            console.log(user.phoneNumber);
            this.phoneNumber = this.formatPhoneNumber(user.phoneNumber);
          }
        }
        this.getLatestUnverifiedVerification();
      });
  }

  private updateStep(): void {
    const nextStep = BecomeATutorStep.References;
    this._tutorWizardService.updateStep(nextStep)
      .pipe(
        takeUntil(this.destroyed$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this._becomeATutorService.currentStep = nextStep;
      });
  }
}
