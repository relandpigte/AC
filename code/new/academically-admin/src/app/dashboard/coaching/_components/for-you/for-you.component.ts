import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CoachingDto, CoachingDtoPagedResultDto, CoachingsServiceProxy, DateGrains, PostsServiceProxy, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { PurchaseServiceComponent } from '@shared/components/purchase-service/purchase-service.component';

@Component({
  selector: 'app-coaching-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.less'],
  animations: [appModuleAnimation()],
})
export class ForYouComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: CoachingDtoPagedResultDto  } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[], totalCount: 3 } as CoachingDtoPagedResultDto };

  featured: CoachingDto[] = Array(5).fill([]).map(() => this.generateRandomCoaching()) as CoachingDto[];
  latest: CoachingDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: CoachingDtoPagedResultDto;
  popular: CoachingDtoPagedResultDto;

  isLoading = true;
  isPopularLoading = true;
  isLoadingCoaching = false;

  data: { [key: string]: CoachingDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 3;

  selectedTopics: string[] = [];

  latestMaxItems: number = 0;
  lastMonthMaxItems: number = 0;
  popularMaxItems: number = 0;

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : null; }
  get validTopics(): string[] { return this.topics.filter(x => x); }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _coachingsService: CoachingsServiceProxy,
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

  private loadGroupedByTopics(currentCount: number, topic?: string): void {
    this._coachingsService.getByTopic(this.appSession.userId, topic, undefined, currentCount, this.itemsPerGroup)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(coachings => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...coachings[topic]?.items)
      } else {
        this.topicGroups = coachings;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    // this.isLoading = true;
    this._coachingsService.getByDates(this.appSession.userId, start, moving, end, DateGrains.Aged30, undefined, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedCoachings => {
        Object.keys(groupedCoachings ?? {}).forEach(range => {
          const [startDate] = range.split(' - ');
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedCoachings[range];
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedCoachings[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedCoachings[range];
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedCoachings[range].items.forEach(item => {
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
    this._coachingsService.getByPopularity(this.appSession.userId, undefined, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedCourses => {
        if (groupedCourses) {
          Object.keys(groupedCourses).forEach(label => {
            const [startDate] = label.split(' - ');

            if (label == 'Popular') {
              if (currentCount == 0) {
                this.popular = groupedCourses[label];
                this.popularMaxItems = groupedCourses[label]?.totalCount;
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
              else {
                this.popular.items.push(...groupedCourses[label].items);
                this.setPopularShowMoreButtons(this.popular?.items?.length);
              }
            }
          });
        } else {
          this.setPopularShowMoreButtons(this.popular?.items?.length);
        }
      });
  }

  handleFilterTopics(topics: string[]): void {
    this.selectedTopics = topics;
  }

  showTopicShowMoreButton(topic: string): boolean {
    if (this.topicGroups[topic]?.items?.length < this.topicGroups[topic]?.totalCount) {
      return true
    }
    return false;
  }

  onShowMorePopularButtonClick(): void {
    console.log('Show  more popular clicked -->', this.popular?.items?.length)
    this.loadPopular(this.popular?.items?.length);
  }

  onShowMoreLatestButtonClick(): void {
    const lastItem = this.latest.items.slice(-1)[0];
    console.log('LAST ITEM --->', lastItem)
    this.loadGroupedByDates(this.latest.items.length, this.latestStartDate, lastItem.creationTime);
  }

  onShowMoreLastMonthButtonClick(): void {
    const lastItem = this.lastMonth.items.slice(-1)[0];
    console.log('POPULAR BUTTON CLICKED');
    this.loadGroupedByDates(this.lastMonth.items.length, undefined, lastItem.creationTime);
  }

  onShowMoreTopicButtonClick(topic: string): void {
    console.log('SHOW MORE TOPIC BUTTON CLICKED');
    this.loadGroupedByTopics(this.topicGroups[topic].items.length, topic);
  }

  handleServiceCardClick(coaching: CoachingDto): void {
    this._router.navigate(['app/coaching' , coaching.id, 'about']);
  }

  handleServiceCardShareClick(service: any): void {
    this.isLoadingCoaching = true;
    this._postsService.getAvailableServiceByUser(service.id, service.creatorUserId)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingCoaching = false))
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
      this._router.navigate(['app/coaching' , service.id, 'about']);
    } else {
      const modalSettings = this.defaultModalSettings as ModalOptions<PurchaseServiceComponent>;
      modalSettings.class = 'modal-lg modal-dialog-centered';
      modalSettings.initialState = { serviceId: service.id, data: service};
      const modal = this._modalService.show(PurchaseServiceComponent, modalSettings);
      modal.content.onPaid.subscribe(() => this._router.navigate(['app/coaching' , service.id, 'about']));
    }
  }
}
