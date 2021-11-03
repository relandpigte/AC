import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { GetAvailalbeTutorDto, GetAvailalbeTutorDtoPagedResultDto, ProjectsServiceProxy, UserDto, UserDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedTutorsRequestDto extends PagedAndSortedRequestDto {
  searchFilter: string;
}

@Component({
  selector: 'app-browse-tutors',
  templateUrl: './browse-tutors.component.html',
  styleUrls: ['./browse-tutors.component.less'],
  animations: [appModuleAnimation()],
})
export class BrowseTutorsComponent extends PagedListingComponentBase<UserDto> {
  searchFilter: string;
  availableTutors: GetAvailalbeTutorDto[] = [];

  constructor(
    injector: Injector,
    private _projectsService: ProjectsServiceProxy,
  ) {
    super(injector);
  }

  protected list(
    request: PagedTutorsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.searchFilter = this.searchFilter;

    this._projectsService
      .getAvailableTutors(
        request.searchFilter,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GetAvailalbeTutorDtoPagedResultDto) => {
        this.availableTutors = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
