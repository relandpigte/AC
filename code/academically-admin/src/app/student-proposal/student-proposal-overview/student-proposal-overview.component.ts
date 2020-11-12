import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { GetStudentProposalDto, ProposalsServiceProxy, UserSupportServiceDto } from '@shared/service-proxies/service-proxies';
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
  isLoading = false;
  studentFullName = '';
  tutorAreasOfStudies = '';
  moment: any = moment;

  constructor(injector: Injector, private proposalsService: ProposalsServiceProxy, private _acativatedRoute: ActivatedRoute) {
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

  private getStudentProposal() {
    this.isLoading = true;
    this.proposalsService.getStudentProposal(this.id).subscribe(proposal => {
      this.isLoading = false;
      this.studentProposal = proposal;
      this.studentFullName = proposal.user.fullName;
    });
  }

  private getTutorAreasOfStudy() {
    this.isLoading = true;
    this.proposalsService.getTutorDisciplineTaxonomies().subscribe(areasOfStudy => {
      this.isLoading = false;
      this.tutorAreasOfStudies = areasOfStudy;
    });
  }

  private getTutorSupportService() {
    this.isLoading = true;
    this.proposalsService.getTutorSupportService().subscribe(supportService => {
      this.isLoading = false;
      this.tutorSupportService = supportService;
    });
  }
}
