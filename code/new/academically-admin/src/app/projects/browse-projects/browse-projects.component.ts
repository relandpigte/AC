import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProjectDto, ProjectDto, ProjectsServiceProxy, Service2Dto, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-service-category',
  templateUrl: './browse-projects.component.html',
  styleUrls: ['./browse-projects.component.less'],
  animations: [appModuleAnimation()],
})
export class BrowseProjectsComponent extends AppComponentBase implements OnInit {
  projects: ProjectDto[] = [];
  isLoading = false;

  constructor(
    injector: Injector,
    private _projectsService: ProjectsServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._projectsService.getAll(0, '', 0, 50)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        this.projects = response.items;
      });
  }
}
