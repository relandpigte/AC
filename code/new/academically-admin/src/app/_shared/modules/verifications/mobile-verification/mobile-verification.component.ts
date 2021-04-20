import { EventEmitter, Injector, OnDestroy, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PhoneVerificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeData, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

enum PhoneVerificationState {
  NotSent,
  Sent,
  EditSent,
}

@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.less']
})
export class MobileVerificationComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Output() phoneNumberVerified = new EventEmitter<boolean>();
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  PhoneVerificationState = PhoneVerificationState;
  phoneNumber: ChangeData;
  verificationCode: string;
  isLoading = false;
  defaultResendTimerValue = 60;
  resendTimer: number;
  resendTimerSubscription: Subscription;
  currentState = PhoneVerificationState.NotSent;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _phoneVerificationsService: PhoneVerificationsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getLatestUnverifiedVerification();
  }

  ngOnDestroy(): void {
    if (this.resendTimerSubscription) {
      this.resendTimerSubscription.unsubscribe();
    }
  }

  onSendClick(): void {
    this.isLoading = true;
    this._phoneVerificationsService.create(this.phoneNumber.internationalNumber)
      .pipe(finalize(() => {
        this.isLoading = false;
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
    this.isLoading = true;
    this._phoneVerificationsService.verify(this.verificationCode)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success(this.l('PhoneNumberVerificationSuccessMessage'));
        this.phoneNumberVerified.emit(true);
        this._modal.hide();
      });
  }

  onResendClick(): void {
    this.isLoading = true;
    this._phoneVerificationsService.create(this.phoneNumber.internationalNumber)
      .pipe(finalize(() => {
        this.currentState = PhoneVerificationState.Sent;
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.resendTimer = this.defaultResendTimerValue;
        this.initiateResendTimer();
        this.notify.success(this.l('PhoneNumberVerificationSentMessage'));
      });
  }

  onEditPhoneNumberClick(): void {
    this.currentState = PhoneVerificationState.EditSent;
  }

  onCloseClick(): void {
    this._modal.hide();
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
      .subscribe(phoneVerification => {
        if (phoneVerification && phoneVerification.id) {
          this.phoneNumber = {
            internationalNumber: phoneVerification.recipient,
          };
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
}
