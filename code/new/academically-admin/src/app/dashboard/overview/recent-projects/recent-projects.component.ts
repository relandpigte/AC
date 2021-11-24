import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProjectDto, ProjectsServiceProxy, ProjectDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recent-projects',
  templateUrl: './recent-projects.component.html',
  styleUrls: ['./recent-projects.component.less']
})
export class RecentProjectsComponent extends AppComponentBase implements OnInit {
  isLoading = false;
  projects: ProjectDto[] = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _projectsService: ProjectsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getProjects();
  }

  onViewClick(project: ProjectDto): void {
    this._router.navigate(['/app/projects/' + project.id + '/proposals']);
  }

  private getProjects(): void {
    this.isLoading = true;
    this._projectsService
      .getAll(this.appSession.userId, undefined, 0, 3)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: ProjectDtoPagedResultDto) => {
        this.projects = result.items;
      });
  }
}
