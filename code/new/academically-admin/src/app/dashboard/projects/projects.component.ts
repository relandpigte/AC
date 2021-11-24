import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedAndSortedRequestDto } from '@shared/paged-listing-component-base';
import { ProjectDto, ProjectsServiceProxy, ProjectDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

class PagedProjectsRequestDto extends PagedAndSortedRequestDto {
  userIdFilter: number;
  searchKeyword: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent extends PagedListingComponentBase<ProjectDto>  {
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
