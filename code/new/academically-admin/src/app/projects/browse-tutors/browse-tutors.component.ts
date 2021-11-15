import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { GetAvailalbeTutorDto, GetAvailalbeTutorDtoPagedResultDto, ProjectsServiceProxy, UserDto, UserDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

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
  projectId: string;
  searchFilter: string;
  availableTutors: GetAvailalbeTutorDto[] = [];
  isSendingInvitation: boolean[] = [];
  invitedTutors: GetAvailalbeTutorDto[] = [];

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _projectsService: ProjectsServiceProxy,
  ) {
    super(injector);
    this._route.parent.parent.paramMap.subscribe(paramMap => {
      if (paramMap.has('project-id')) {
        this.projectId = paramMap.get('project-id');
      }
    });
  }

  onInviteToQuoteClick(availableTutor: GetAvailalbeTutorDto): void {
    this.message.confirm(
      undefined,
      undefined,
      (result: boolean) => {
        if (result) {
          this.isSendingInvitation[availableTutor.tutor.id] = true;
          this._projectsService.sendProjectInvitation(this.projectId, availableTutor.tutor.id)
            .pipe(
              takeUntil(this.destroyed$),
              finalize(() => {
                this.isSendingInvitation[availableTutor.tutor.id] = false;
              })
            )
            .subscribe(() => {
              this.notify.success(this.l('InvitationSent'));

              this.list(new PagedTutorsRequestDto,this.pageNumber,Function)
            });
        }
      }
    );
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

    this.getInvitedTutors(request, pageNumber, finishedCallback)
  }

  private getInvitedTutors(
    request: PagedTutorsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.searchFilter = this.searchFilter;
    this._projectsService
      .getProjectInvitationTutors(
        request.searchFilter,
        request.skipCount,
        request.maxResultCount,
        this.projectId
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: GetAvailalbeTutorDtoPagedResultDto) => {
        this.invitedTutors = result.items;
        this.showPaging(result, pageNumber);
      });
  }
}
