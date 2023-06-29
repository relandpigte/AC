import { Component, Injector, Input, OnInit } from '@angular/core';
import { ProjectService } from '@app/projects/_services/project.service';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectDto, ProjectsServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { ModalDialogOptions, ModalDialogService } from '@shared/services/modal-dialog.service';
import { takeUntil } from '@node_modules/rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './project-details-header.component.html',
  styleUrls: ['./project-details-header.component.less']
})
export class ProjectDetailsHeaderComponent extends AppComponentBase implements OnInit {
  projectName: string;
  project: ProjectDto;

  constructor(
    injector: Injector,
    private _projectService: ProjectService,
    private _projectsService: ProjectsServiceProxy,
    private _router: Router,
    private _modalDialogService: ModalDialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._projectService.project$.subscribe(project => {
      if (project) {
        this.projectName = project.name;
        this.project = project;
      }
    });
  }

  onDeleteClick(): void {
    const options: ModalDialogOptions = {
      title: this.l('AreYouSure'),
      text: this.l('DeleteProjectConfirmationMessage'),
      confirmCb: (): void => {
        this._projectsService.delete(this.project.id)
          .subscribe(() => {
            this.notify.success('SuccessfullyDeleted');
            this._router.navigate(['/app/dashboard']);
          });
      }
    };
    this._modalDialogService.showConfirmDialog(options);
  }
}
