import { Component, Injector } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { ProjectDto, ProjectsServiceProxy, ProjectDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

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
    private _projectsService: ProjectsServiceProxy,
  ) {
    super(injector);
    this.pageSize = 5;
  }

  list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._projectsService
      .getAllFormHome(
        request.maxResultCount,
        request.skipCount,
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
}
