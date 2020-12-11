import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, SessionDto, TutorOffersServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'tutorial-project-brief',
  templateUrl: './tutorial-project-brief.component.html',
  styleUrls: ['./tutorial-project-brief.component.less']
})
export class TutorialProjectBriefComponent extends AppComponentBase implements OnInit {
  id: string;
  tutorOffers: GetTutorOfferDto[] = [];
  sessions: SessionDto[] = [];
  moment: any = moment;
  constructor(injector: Injector, private tutorOffersService: TutorOffersServiceProxy, private _activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.id) {
        this.getTutorOffers();
      }
    });
  }

  private getTutorOffers(): void {
    this.tutorOffersService.getAllTutorOfferSessions(this.id).subscribe(tutorOffers => {
      this.tutorOffers = tutorOffers;
      _.forEach(this.tutorOffers, tutorOffer => {
        _.map(tutorOffer.sessions, item => {
          const session = item;
          session.tutorProfile = tutorOffer.tutor;

          this.sessions.push(session);
        });
      });
    });
  }
}
