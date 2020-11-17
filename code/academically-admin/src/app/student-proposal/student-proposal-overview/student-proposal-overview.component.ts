import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateTutorOfferDto,
  GetStudentProposalDto,
  ProposalsServiceProxy,
  TutorOffersServiceProxy,
  UserSupportServiceDto
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'student-proposal-overview',
  templateUrl: './student-proposal-overview.component.html',
  styleUrls: ['./student-proposal-overview.component.less']
})
export class StudentProposalOverviewComponent extends AppComponentBase implements OnInit {
  id: string;
  studentProposal: GetStudentProposalDto = new GetStudentProposalDto();
  tutorSupportService: UserSupportServiceDto = new UserSupportServiceDto();
  offer: CreateTutorOfferDto = new CreateTutorOfferDto();
  highLevelTutorialAreasOfStudies: string[] = [];
  isLoading = false;
  studentFullName = '';
  tutorAreasOfStudies = '';
  moment: any = moment;

  constructor(
    injector: Injector,
    private _proposalsService: ProposalsServiceProxy,
    private _acativatedRoute: ActivatedRoute,
    private _tutorOfferService: TutorOffersServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._acativatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('tutorialId');
      if (this.id) {
        this.getStudentProposal();
        this.getTutorAreasOfStudy();
        this.getTutorSupportService();
        this.isLoading = false;
      }
    });
  }

  onAcceptProposalClick(): void {
    this.isLoading = true;
    this.offer.isSubmitted = true;
    this._tutorOfferService.create(this.offer).subscribe(() => {
      this.isLoading = false;
      abp.notify.info(this.l('SubmitOfferMessage'));
      this._router.navigate(['app/home']);
    });
  }

  onDeclineProposalClick(): void {
    this.isLoading = true;
    this.offer.isSubmitted = false;
    this._tutorOfferService.create(this.offer).subscribe(() => {
      this.isLoading = false;
      abp.notify.info(this.l('DecineOfferMessage'));
      this._router.navigate(['app/home']);
    });
  }

  private getStudentProposal(): void {
    this.isLoading = true;
    this._proposalsService.getStudentProposal(this.id).subscribe(proposal => {
      this.isLoading = false;
      this.studentProposal = proposal;
      this.studentFullName = proposal.user.fullName;
      this.offer.tutorialId = this.id;
      this.offer.studentId = this.studentProposal.user.id;
      this.getStudentTutorialHighestLevlAreasOfStudy(proposal.user.id, this.id);
    });
  }

  private getTutorAreasOfStudy(): void {
    this.isLoading = true;
    this._proposalsService.getTutorDisciplineTaxonomies().subscribe(areasOfStudy => {
      this.isLoading = false;
      this.tutorAreasOfStudies = areasOfStudy;
    });
  }

  private getTutorSupportService(): void {
    this.isLoading = true;
    this._proposalsService.getTutorSupportService().subscribe(supportService => {
      this.isLoading = false;
      this.tutorSupportService = supportService;
    });
  }

  private getStudentTutorialHighestLevlAreasOfStudy(studentId: number, tutorialId: string): void {
    this.isLoading = true;
    this._proposalsService.getTutorialHighestLevelAreaOfStudies(studentId, tutorialId).subscribe(studentTutorialAreasOfStudies => {
      this.highLevelTutorialAreasOfStudies = studentTutorialAreasOfStudies;
    });
  }
}
