import { Component, inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { GetTutorOfferDto, TutorOffersServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent extends AppComponentBase implements OnInit {
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
      console.log(this.projects);
    });
  }
}
