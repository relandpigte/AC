import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, TutorOffersServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'tutor-recent-projects-widgets',
  templateUrl: './tutor-recent-projects-widgets.component.html',
  styleUrls: ['./tutor-recent-projects-widgets.component.less']
})
export class TutorRecentProjectsWidgetsComponent extends AppComponentBase implements OnInit {
  projects: GetTutorOfferDto[] = [];
  constructor(injector: Injector, private _tutorOffersService: TutorOffersServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTutorOffers();
  }

  private getTutorOffers(): void {
    this._tutorOffersService.getTutorProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
}
