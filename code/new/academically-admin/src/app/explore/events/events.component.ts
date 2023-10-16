import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DateGrains, EventCategory, EventDto, EventDtoPagedResultDto, EventsServiceProxy, PostsServiceProxy, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';

@Component({
  selector: 'app-explore-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreEventsComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: EventDtoPagedResultDto  } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomEvent()) as EventDto[], totalCount: 3 } as EventDtoPagedResultDto };

  featured: EventDto[] = Array(5).fill([]).map(() => this.generateRandomEvent()) as EventDto[];
  latest: EventDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: EventDtoPagedResultDto;
  popular: EventDtoPagedResultDto;

  isLoading = true;
  isPopularLoading = true;
  isLoadingEvent = false;

  data: { [key: string]: EventDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;

  itemsPerGroup = 6;
  popularItems = 3;

  latestMaxItems: number = 0;
  lastMonthMaxItems: number = 0;
  popularMaxItems: number = 0;

  selectedTopics: string[] = [];

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : []; }
  get validTopics(): string[] { return this.topics?.filter(x => x); }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _eventsService: EventsServiceProxy,
    private _postsService: PostsServiceProxy,
    private _servicesService: ServicesServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    if (this.isGroupByTopics) this.loadGroupedByTopics(0);
    else {
      this.loadGroupedByDates(0);
      this.loadPopular(0);
    }
  }

  setLatestShowMoreButtons(items: number): void {
    if (items < this.latestMaxItems) {
      this.showLastestShowMore = true;
    } else {
      this.showLastestShowMore = false;
    }
  }

  setLastMonthShowMoreButtons(items: number): void {
    console.log('setLastMonthShowMoreButtons() --->', items, this.lastMonthMaxItems)
    if (items < this.lastMonthMaxItems) {
      this.showLastMonthShowMoreButton = true;
    } else {
      this.showLastMonthShowMoreButton = false;
    }
  }

  setPopularShowMoreButtons(items: number): void {
    if (items < this.popularMaxItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }

  setTopicShowMoreButtons(items: number): void {
    if (items == this.popularItems) {
      this.showPopularShowMoreButton = true;
    } else {
      this.showPopularShowMoreButton = false;
    }
  }

  private loadGroupedByTopics(currentCount: number, topic?: string): void {
    this._eventsService.getByTopics(this.appSession.userId, topic, undefined, currentCount, this.itemsPerGroup)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(events => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...events[topic].items)
      } else {
        this.topicGroups = events;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this._eventsService.getByDates(this.appSession.userId, start, moving, end, DateGrains.Aged30, undefined, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedEvents => {
        Object.keys(groupedEvents ?? {}).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedEvents[range];
              this.lastMonthMaxItems = groupedEvents[range].totalCount;
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedEvents[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedEvents[range];
              this.latestMaxItems = groupedEvents[range].totalCount;
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedEvents[range].items.forEach(item => {
                this.latest.items.push(item);
              });
              this.setLatestShowMoreButtons(this.latest?.items?.length);
            }
          }
        });
      });
  }

  private loadPopular(currentCount: number): void {
    // this.isPopularLoading = true;
    this._eventsService.getByPopularity(this.appSession.userId, undefined, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedEvents => {
        if (groupedEvents) {
          Object.keys(groupedEvents ?? {}).forEach(label => {
            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedEvents[label];
                this.popularMaxItems = groupedEvents[label]?.totalCount;
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedEvents[label].items);
                this.setPopularShowMoreButtons(this.popular.items?.length);
              }
            }
          });
        } else {
          this.setPopularShowMoreButtons(this.popular?.items?.length);
        }
      });
  }

  showTopicShowMoreButton(topic: string): boolean {
    if (this.topicGroups[topic]?.items?.length < this.topicGroups[topic]?.totalCount) {
      return true
    }
    return false;
  }

  onShowMorePopularButtonClick(): void {
    this.loadPopular(this.popular?.items?.length);
  }

  onShowMoreLatestButtonClick(): void {
    const lastItem = this.latest.items.slice(-1)[0];
    this.loadGroupedByDates(this.latest.items.length, this.latestStartDate, lastItem.creationTime);
  }

  onShowMoreLastMonthButtonClick(): void {
    const lastItem = this.lastMonth.items.slice(-1)[0];
    this.loadGroupedByDates(this.lastMonth.items.length, undefined, lastItem.creationTime);
  }

  onShowMoreTopicButtonClick(topic: string): void {
    console.log('SHOW MORE TOPIC BUTTON CLICKED');
    this.loadGroupedByTopics(this.topicGroups[topic].items.length, topic);
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  handleServiceCardClick(event: EventDto): void {
    this._router.navigate(['app/events' , event.id, 'about']);
  }

  handleServiceCardShareClick(service: any): void {
    this.isLoadingEvent = true;
    this._postsService.getAvailableService(service.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingEvent = false))
      .subscribe(service => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: false,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: { serviceId: service.id },
          selectedService: service
        };
        this._modalService.show(UpsertPostComponent, modalSettings).content;
      });
  }

  async handleServiceCardActionClick(event: any) {
    try {
      const { action, data } = event;
      switch(action) {
        case 'purchase':
          await this.onPurchaseClick(data);
          break;
      }
    } catch(err) {
      console.error(err);
    }
  }

  private async onPurchaseClick(service: any) {
    if (!service) return;

    const purchase = await this._servicesService.getAllPurchases(service.id, this.appSession.userId).toPromise();
    if (purchase?.length) {
      this.redirectToServiceLandingPage(service)
    } else {
      const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered';
      modalSettings.initialState = { serviceId: service.id, data: service};
      const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
      modal.content.onPaid.subscribe(() => this.redirectToServiceLandingPage(service));
    }
  }

  private redirectToServiceLandingPage(service: any) {
    const d = service as EventDto;
    if (d.category === EventCategory.Broadcast) this.handleBroadcastServiceCardClick(service);
    this.handleWorkshopServiceCardClick(service);
  }

  handleBroadcastServiceCardClick(event: EventDto): void {
    this._router.navigate(['app/events' , event.id, 'about']);
  }

  handleWorkshopServiceCardClick(event: EventDto): void {
    this._router.navigate(['app/events' , event.id, 'about']);
  }
}
