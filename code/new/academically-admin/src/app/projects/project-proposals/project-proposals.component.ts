import { Injector } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectDto, ProjectOfferDto, ProjectOffersServiceProxy, UserDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize, takeUntil } from 'rxjs/operators';
import { ProjectService } from '../_services/project.service';
import { ViewTutorProposalComponent } from './view-tutor-proposal/view-tutor-proposal.component';

@Component({
  selector: 'app-project-proposals',
  templateUrl: './project-proposals.component.html',
  styleUrls: ['./project-proposals.component.less'],
  animations: [appModuleAnimation()],
})
export class ProjectProposalsComponent extends AppComponentBase implements OnInit {
  isLoading = false;
  project: ProjectDto = new ProjectDto();
  projectOffers: ProjectOfferDto[] = [];
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
    private _projectService: ProjectService,
    private _projectOffersService: ProjectOffersServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._projectService.project$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(project => {
      this.project = project;
      if (project) {
        const self = this;
        setTimeout(() => self.getProjectOffers(), 250);
      }
    });
  }

  getProjectOffers(): void {
    this.isLoading = true;
    this._projectOffersService
      .getAll(0, this.project.id, '', 0, 50)
        .pipe(
          takeUntil(this.destroyed$),
          finalize(() => this.isLoading = false),
        )
        .subscribe(response => {
          this.projectOffers = response.items;
        });
  }

  getProfilePic(user: UserDto): string {
    return this.getProfilePictureFromDocument(user.profilePictureDocument, user.id);
  }

  onViewOfferClick(projectOffer: ProjectOfferDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg modal-xl';
    modalSettings.initialState = {
      projectOffer: projectOffer,
    };
    this._modalService.show(ViewTutorProposalComponent, modalSettings);
  }
}
