import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ProposalsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-student-proposal',
  templateUrl: './student-proposal.component.html',
  styleUrls: ['./student-proposal.component.less'],
  animations: [appModuleAnimation()]
})
export class StudentProposalComponent extends AppComponentBase implements OnInit {
  id: string;
  studentFullName = '';
  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private proposalsService: ProposalsServiceProxy,
    private _router: Router
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('tutorialId');
      if (this.id) {
        this.getStudentProposal();
      }
    });
  }

  onScrollClick(e: any, el: HTMLElement): void {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private getStudentProposal() {
    this.proposalsService.getStudentProposal(this.id).subscribe(proposal => {
      if (proposal.user) {
        this.studentFullName = proposal.user.fullName;
      } else {
        this._router.navigate(['/app/not-found']);
      }
    });
  }
}
