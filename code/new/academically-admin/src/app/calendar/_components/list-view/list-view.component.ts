import { Component, Injector, OnInit } from '@angular/core';
import { PagedAndSortedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { AvailableServiceDto, AvailableServiceDtoPagedResultDto, CoachingDto, EventDto, PostsServiceProxy, ScheduledServiceType, ServicesType } from '@shared/service-proxies/service-proxies';
import { forEach } from 'lodash-es';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

export enum ScheduleListTabs {
    Upcoming, Past, Cancelled
}

@Component({
    selector: 'app-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.less']
})
export class ScheduleListViewComponent extends PagedListingComponentBase<AvailableServiceDto> implements OnInit {

    ScheduleListTabs = ScheduleListTabs;
    activeTab: ScheduleListTabs = ScheduleListTabs.Upcoming;

    serviceMap: { [dt: string]: (CoachingDto | EventDto)[] } = {};

    isLoadingList$ = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private _postsService: PostsServiceProxy,
    ) {
        super(injector);
    }

    get isLoading$() { return combineLatest([this.isLoadingList$]).pipe(switchMap((loaders) => of(loaders.some(l => l)))); }
    get hasServices(): boolean { return !!this.serviceMap && !!Object.keys(this.serviceMap).length; }
    get scheduleType(): ScheduledServiceType {
        switch(this.activeTab) {
            case ScheduleListTabs.Upcoming:
                return ScheduledServiceType.Upcoming;
            case ScheduleListTabs.Past:
                return ScheduledServiceType.Past;
            case ScheduleListTabs.Cancelled:
                return ScheduledServiceType.Cancelled;
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    changeActiveTab(tab: ScheduleListTabs): void {
        this.activeTab = tab;
        this.refresh();
    }

    protected list(request: PagedAndSortedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.isLoadingList$.next(true);
        this._postsService
            .getScheduledServices(
                this.isTutor ? this.appSession.userId : undefined,
                this.scheduleType,
                request.skipCount,
                request.maxResultCount
            )
            .pipe(finalize(() => {
                this.isLoadingList$.next(false);
                finishedCallback();
            }))
            .subscribe((result: AvailableServiceDtoPagedResultDto) => {
                this.groupServices(result.items.map(s => {
                    if (s.serviceType === ServicesType.Coaching) return CoachingDto.fromJS(s);
                    return EventDto.fromJS(s);
                }));
                this.showPaging(result, pageNumber);
            });
    }

    private groupServices(services: (CoachingDto | EventDto)[]): void {
        this.serviceMap = {};
        services.forEach(s => {
            const dateStr = 'eventDateTime' in s ? s.eventDateTime.format('MMMM YYYY') : 'No date';
            this.serviceMap = { ...this.serviceMap, [dateStr]: [...(this.serviceMap[dateStr] || []), s] };
        });
    }

}
