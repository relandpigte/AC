import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateTutorOfferDto,
  GetStudentProposalDto,
  ProposalsServiceProxy,
  TutorOffersServiceProxy,
  UserSupportServiceDto,
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ReviseStudentProposalComponent } from './revise-student-proposal/revise-student-proposal.component';
import * as _ from 'lodash';

@Component({
  selector: 'student-proposal-overview',
  templateUrl: './student-proposal-overview.component.html',
  styleUrls: ['./student-proposal-overview.component.less'],
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
  coverLetterMaxWordCount = 500;

  constructor(
    injector: Injector,
    private _proposalsService: ProposalsServiceProxy,
    private _acativatedRoute: ActivatedRoute,
    private _tutorOfferService: TutorOffersServiceProxy,
    private _router: Router,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._acativatedRoute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('tutorialId');
      if (this.id) {
        this.getStudentProposal();
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
    this.offer.isSubmitted = false;
    this._tutorOfferService.create(this.offer).subscribe(() => {
      this.isLoading = false;
      abp.notify.info(this.l('DecineOfferMessage'));
      this._router.navigate(['app/home']);
    });
  }

  onReviseClick(): void {
    this.showReviseStudentProposalModal();
  }

  onKeyup(coverLeter: string): void {
    if (coverLeter) {
      const words = coverLeter.match(/\S+/g).length;
      if (words > this.coverLetterMaxWordCount) {
        const trimmed = coverLeter.split(/\s+/, this.coverLetterMaxWordCount).join(' ');
        this.offer.coverLetter = trimmed + ' ';
      }
    }
  }

  getCoverLetterWordCount(): number {
    const wordCount = this.offer.coverLetter ? this.offer.coverLetter.match(/\S+/g).length : 0;
    if (wordCount > this.coverLetterMaxWordCount) {
      return this.coverLetterMaxWordCount;
    }
    return wordCount;
  }

  private getStudentProposal(): void {
    this._proposalsService.getStudentProposal(this.id).subscribe((proposal) => {
      this.isLoading = false;
      this.studentProposal = proposal;
      this.studentFullName = proposal.student.user.fullName;
      this.getStudentTutorialHighestLevlAreasOfStudy();
      this.getTutorOffer();
      this.getTutorAreasOfStudy();
      this.getTutorSupportService();
    });
  }

  private getTutorAreasOfStudy(): void {
    this._proposalsService.getTutorDisciplineTaxonomies().subscribe((areasOfStudy) => {
      this.isLoading = false;
      this.tutorAreasOfStudies = areasOfStudy;
    });
  }

  private getTutorSupportService(): void {
    this._proposalsService.getTutorSupportService(null).subscribe((supportService) => {
      this.isLoading = false;
      if (!_.isEmpty(supportService)) {
        this.tutorSupportService = supportService;
        this.offer.singleSessionRate = !this.offer.singleSessionRate
          ? this.tutorSupportService.userSupportServiceSessionRate.singleSessionRate
          : this.offer.singleSessionRate;

        this.offer.multipleSessionRate = !this.offer.multipleSessionRate
          ? this.tutorSupportService.userSupportServiceSessionRate.multipleSessionRate
          : this.offer.multipleSessionRate;

        this.offer.multipleSessionCount = !this.offer.multipleSessionCount
          ? this.tutorSupportService.userSupportServiceSessionRate.multipleSessionCount
          : this.offer.multipleSessionCount;
      }
    });
  }

  private getStudentTutorialHighestLevlAreasOfStudy(): void {
    this._proposalsService
      .getTutorialHighestLevelAreaOfStudies(this.studentProposal.student.userId, this.id)
      .subscribe((studentTutorialAreasOfStudies) => {
        this.highLevelTutorialAreasOfStudies = studentTutorialAreasOfStudies;
      });
  }

  private getTutorOffer(): void {
    this._tutorOfferService.getOffer(this.id).subscribe((offer) => {
      if (Object.keys(offer).length === 0) {
        this.offer.tutorialId = this.id;
        this.offer.studentId = this.studentProposal.student.userId;
      } else {
        this.offer = offer;
      }
    });
  }

  private showReviseStudentProposalModal(): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.initialState = {
      offer: this.offer,
    };
    const modalRef = this._modalService.show(ReviseStudentProposalComponent, modalSettings);
    const modal: ReviseStudentProposalComponent = modalRef.content;
    modal.modalSave.subscribe((offer: CreateTutorOfferDto) => {
      this.offer = offer;
    });
  }
}
