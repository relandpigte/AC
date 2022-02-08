import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ProjectDto, ProjectsServiceProxy, ProjectDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedProjectsRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchKeyword: string;
}

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.less'],
  animations: [appModuleAnimation()],
})
export class CoachingComponent extends PagedListingComponentBase<ProjectDto>  {
  projects: ProjectDto[];
  deleteLoaders: boolean[] = [];

  constructor(
    injector: Injector,
    private _router: Router,
    private _projectsService: ProjectsServiceProxy,
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedProjectsRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.userIdFilter = this.appSession.userId;

    this._projectsService
      .getAll(
        request.userIdFilter,
        request.searchKeyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: ProjectDtoPagedResultDto) => {
        this.projects = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  onViewClick(project: ProjectDto): void {
    this._router.navigate(['/app/projects/' + project.id + '/proposals']);
  }
}
