import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTutorialDto, UserTutorialsServiceProxy } from '@shared/service-proxies/service-proxies';
import { TutorialProjectBriefComponent } from './tutorial-project-brief/tutorial-project-brief.component';
import { TutorialProposalComponent } from './tutorial-proposal/tutorial-proposal.component';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.less'],
  animations: [appModuleAnimation()],
})
export class TutorialComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('tutorialProjectBriefComponent') tutorialProjectBriefComponent: TutorialProjectBriefComponent;
  @ViewChild('tutorialProposalComponent') tutorialProposalComponent: TutorialProposalComponent;
  tutorial: UserTutorialDto = new UserTutorialDto();
  id: string;

  constructor(
    injector: Injector,
    private _userTutorialsService: UserTutorialsServiceProxy,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.getTutorial();
    });
  }

  ngAfterViewInit(): void {
    this.tutorialProposalComponent.sessionBooked.subscribe(result => {
      if (result) {
        this.tutorialProjectBriefComponent.getTutorOffers();
      }
    })
  }

  private getTutorial(): void {
    this._userTutorialsService.get(this.id)
      .subscribe(tutorial => {
        this.tutorial = tutorial;
      })
  }
}
