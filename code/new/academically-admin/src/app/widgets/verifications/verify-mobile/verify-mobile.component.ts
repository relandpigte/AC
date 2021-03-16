import { Component, EventEmitter, Injector, OnDestroy, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PhoneVerificationsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeData, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.less']
})
export class VerifyMobileComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Output() phoneNumberVerified = new EventEmitter<boolean>();
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  phoneNumber: ChangeData;
  verificationCode: string;
  isVerificationCodeSent = false;
  isLoading = false;
  isResending = false;
  isVerificationCodeResent = false;
  defaultResendTimerValue = 60;
  resendTimer: number;
  resendTimerSubscription: Subscription;

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
        this.isVerificationCodeSent = true;
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
    this.isResending = true;
    this._phoneVerificationsService.create(this.phoneNumber.internationalNumber)
      .pipe(finalize(() => {
        this.isResending = false;
      }))
      .subscribe(() => {
        this.isVerificationCodeResent = true;
        this.resendTimer = this.defaultResendTimerValue;
        this.initiateResendTimer();
        this.notify.success(this.l('PhoneNumberVerificationSentMessage'));
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  private initiateResendTimer(): void {
    this.resendTimerSubscription = interval(1000).subscribe(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        this.resendTimerSubscription.unsubscribe();
        this.isVerificationCodeResent = false;
        this.resendTimer = this.defaultResendTimerValue;
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
          this.isVerificationCodeSent = true;
          const resendTimer = this.diffMomentDatesSeconds(
            phoneVerification.dateSent.add(this.defaultResendTimerValue, 'seconds'),
            moment()
          );
          if (resendTimer > 0) {
            this.resendTimer = resendTimer;
            this.isVerificationCodeResent = true;
            this.initiateResendTimer();
          }
        }
      });
  }
}
