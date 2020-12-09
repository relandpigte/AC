import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, SessionDto, TutorOffersServiceProxy, UserSessionsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'student-proposal-live-sessions',
  templateUrl: './student-proposal-live-sessions.component.html',
  styleUrls: ['./student-proposal-live-sessions.component.less']
})
export class StudentProposalLiveSessionsComponent extends AppComponentBase implements OnInit {
  tutorOffer: GetTutorOfferDto = new GetTutorOfferDto();
  sessions: SessionDto[] = [];
  isLoading = false;
  moment: any = moment;
  id: string;
  constructor(
    injector: Injector,
    private _tutorOfferService: TutorOffersServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private userSerssionServic: UserSessionsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('tutorialId');
      if (this.id) {
        this.getTutorOfferSesssions();
      }
    });
  }

  getDuration(totalMinutes: number): any {
    const hours = Math.floor(totalMinutes / 60) > 10 ? Math.floor(totalMinutes / 60) : '0' + Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60 > 10 ? totalMinutes % 60 : '0' + (totalMinutes % 60);
    return hours + ':' + minutes;
  }

  onConfirmClick(session: SessionDto): void {
    this.isLoading = true;
    session.status = 2;
    this.userSerssionServic.saveSessionDetail(session).subscribe(() => {
      this.isLoading = false;
      this.notify.success(this.l('SavedSuccessfully'));
      this.getTutorOfferSesssions();
    });
  }

  private getTutorOfferSesssions() {
    this._tutorOfferService.getTutorOfferSessions(this.id).subscribe(tutorOffer => {
      this.isLoading = false;
      this.tutorOffer = tutorOffer;
      this.sessions = tutorOffer.sessions;
    });
  }
}
