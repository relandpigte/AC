import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectDto, ProjectsServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.less']
})
export class ViewProjectComponent extends AppComponentBase implements OnInit {
  @Input() project: ProjectDto = new ProjectDto();
  userTitle: string;
  isLoading = false;

  constructor(
    injector: Injector,
    private _modal: BsModalRef,
    private _router: Router,
    private _projectsService: ProjectsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._projectsService.get(this.project.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.project = response;

        if (response && response.creatorUser) {
          this.userTitle =  response.creatorUser.roleNames.filter(e => e.toLowerCase() === 'tutor').length > 0 ? 'Tutor' : 'Student';
        }
      });
  }

  onCloseClick(): void {
    this._modal.hide();
  }

  onMakeAnOfferClick(): void {
    this._modal.hide();
    this._router.navigate([ `/app/projects/${this.project.id}/offer`]);
  }
}
