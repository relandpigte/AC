import { Component, Injector, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  GetProfileDetailDto,
  GetTutorOfferDto,
  SessionDto,
  TimezoneInfoDto,
  TimezonesServiceProxy,
  UserProfilesServiceProxy,
  UserSessionsServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsDatepickerConfig, DateFormatter } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tutorial-accept-proposal-book-session',
  templateUrl: './tutorial-accept-proposal-book-session.component.html',
  styleUrls: ['./tutorial-accept-proposal-book-session.component.less']
})
export class TutorialAcceptProposalBookSessionComponent extends AppComponentBase implements OnInit {
  @Input() tutorOffer: GetTutorOfferDto;
  @Output() sessionBooked = new EventEmitter<boolean>(false);
  userSession: SessionDto = new SessionDto();
  startTime: string;
  timezones: TimezoneInfoDto[] = [];
  userProfile: GetProfileDetailDto = new GetProfileDetailDto();
  datePickerConfig: BsDatepickerConfig;
  hourInput = '00';
  minuteInput = '00';
  hourSessionDurationInput = '00';
  minuteSessionDurationInput = '00';
  acceptTutorialBookSessionCheck = false;
  acceptDiscountBookSessionCheck = false;
  hours = [];
  minutes = [];
  minutesSessionDuration = [];
  isLoading = false;
  sessionDate: moment.Moment;

  constructor(
    injector: Injector,
    private _userProfilesService: UserProfilesServiceProxy,
    private _userSessionService: UserSessionsServiceProxy,
    private _timezonesService: TimezonesServiceProxy,
    private modal: BsModalRef
  ) {
    super(injector);
    this.datePickerConfig = new BsDatepickerConfig();
    this.datePickerConfig.showWeekNumbers = false;
    this.datePickerConfig.dateInputFormat = 'DD/MM/YYYY';
    this.userSession.timeZone = '';
  }

  ngOnInit(): void {
    this.getHours();
    this.getMintues();
    this.getMinutesSessionDuration();
    this.getUserProfile();
    this.getTimezonesList();
    this.userSession.tutorOfferId = this.tutorOffer.id;
    this.userSession.status = 1; // pending
  }

  onTimezoneChange(): void {
    this._userProfilesService.saveUserTimezoneDetail(this.userProfile.userId, this.userProfile.timezoneId).subscribe(() => {
      this.notify.success(this.l('SavedSuccessfully'));
    });
  }

  getTotal(): any {
    let total = 0;
    if (this.acceptTutorialBookSessionCheck) {
      total += this.tutorOffer.singleSessionRate;
    }

    if (this.acceptDiscountBookSessionCheck) {
      const multipleSessionTotal = this.tutorOffer.multipleSessionCount * this.tutorOffer.multipleSessionRate;
      total += multipleSessionTotal;
    }

    return total;
  }

  onFormSubmit(): void {
    this.isLoading = true;
    const sessionDate = `${moment(this.sessionDate).format('YYYY-MM-DD')} ${this.hourInput}:${this.minuteInput}:00`;
    const sessionDuration = Number(this.hourSessionDurationInput) * 60 + Number(this.minuteSessionDurationInput);
    this.userSession.duration = sessionDuration;
    this.userSession.sessionDate = moment(sessionDate, 'YYYY-MM-DD HH:mm:ss').utc();

    this._userSessionService.save(this.userSession).subscribe(() => {
      this.isLoading = false;
      this.notify.success(this.l('SavedSuccessfully'));
      this.sessionBooked.emit(true);
      this.close();
    });
  }

  private getHours(): void {
    for (let x = 0; x < 25; x++) {
      if (x >= 10) {
        this.hours.push(x);
      } else {
        this.hours.push('0' + x);
      }
    }
  }

  private getMintues(): void {
    for (let x = 0; x < 60; x++) {
      if (x >= 10) {
        this.minutes.push(x);
      } else {
        this.minutes.push('0' + x);
      }
    }
  }

  private getMinutesSessionDuration(): void {
    for (let x = 0; x <= 60; x += 5) {
      if (x >= 10) {
        this.minutesSessionDuration.push(x);
      } else {
        this.minutesSessionDuration.push('0' + x);
      }
    }
  }

  private close(): void {
    this.modal.hide();
  }

  private getUserProfile(): void {
    this._userProfilesService.getDetail(this.appSession.user.id).subscribe(userProfile => {
      this.userProfile = userProfile;
    });
  }

  private getTimezonesList(): void {
    this._timezonesService.getTimezonesList().subscribe(timezones => {
      this.timezones = timezones;
    });
  }
}
