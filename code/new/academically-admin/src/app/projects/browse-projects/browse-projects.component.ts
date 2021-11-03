import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, ProjectDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { ViewProjectComponent } from './_components/view-project/view-project.component';

@Component({
  selector: 'app-service-category',
  templateUrl: './browse-projects.component.html',
  styleUrls: ['./browse-projects.component.less'],
  animations: [appModuleAnimation()],
})
export class BrowseProjectsComponent extends AppComponentBase implements OnInit {
  projects: ProjectDto[] = [];
  isLoading = false;
  autoOpenId: string;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _projectsService: ProjectsServiceProxy,
    private _modalService: BsModalService,
  ) {
    super(injector);
    this._route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.autoOpenId = paramMap.get('id');
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._projectsService.getAll(0, '', 0, 50)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.projects = response.items;
        if (this.autoOpenId) {
          const project = this.projects.find(e => e.id === this.autoOpenId);
          if (project) {
            this.onViewProjectDetails(project);
          }
        }
      });
  }

  onViewProjectDetails(project: ProjectDto): void {
    const modalSettings = this.defaultModalSettings;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      project: project,
    };
    this._modalService.show(ViewProjectComponent, modalSettings);
  }
}
