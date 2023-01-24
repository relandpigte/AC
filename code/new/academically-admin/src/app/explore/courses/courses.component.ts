import { Component, Injector, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CourseDto, CourseDtoPagedResultDto, CoursesServiceProxy, DateGrains, PostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, takeUntil } from 'rxjs/operators';

import { Router } from '@angular/router';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import * as moment from 'moment';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-explore-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.less'],
  animations: [appModuleAnimation()],
})
export class ExploreCoursesComponent extends AppComponentBase implements OnInit {

  @Input() isGroupByTopics = false;

  topicGroups: { [key: string]: CourseDtoPagedResultDto  } = { 'Topic': { items: Array(3).fill([]).map(() => this.generateRandomCourse()) as CourseDto[], totalCount: 3 } as CourseDtoPagedResultDto };

  featured: CourseDto[] = Array(5).fill([]).map(() => this.generateRandomCourse()) as CourseDto[];
  latest: CourseDtoPagedResultDto;
  latestStartDate: moment.Moment;
  lastMonth: CourseDtoPagedResultDto;
  popular: CourseDtoPagedResultDto;

  isLoading = true;
  isPopularLoading = true;
  isLoadingCourse = false;

  data: { [key: string]: CourseDto[] };

  showLastestShowMore: boolean = true;
  showLastMonthShowMoreButton: boolean = true;
  showPopularShowMoreButton: boolean = true;
  itemsPerGroup = 6;
  popularItems = 3;

  latestMaxItems: number = 0;
  lastMonthMaxItems: number = 0;
  popularMaxItems: number = 0;

  selectedTopics: string[] = [];

  get topics(): string[] { return this.topicGroups ? Object.keys(this.topicGroups) : null; }
  get validTopics(): string[] { return this.topics.filter(x => x); }
  get filteredTopics(): string[] { return this.topics.filter(t => this.selectedTopics.includes(t)); }

  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: BsModalService,
    private _coursesService: CoursesServiceProxy,
    private _postsService: PostsServiceProxy
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
    this._coursesService.getByTopic(this.appSession.userId, topic, currentCount, this.itemsPerGroup)
    .pipe(takeUntil(this.destroyed$))
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(courses => {
      if (topic) {
        this.topicGroups[topic]?.items?.push(...courses[topic].items)
      } else {
        this.topicGroups = courses;
      }
    });
  }

  private loadGroupedByDates(currentCount: number, start?: moment.Moment, moving?: moment.Moment, end?: moment.Moment): void {
    this.isLoading = true;
    this._coursesService.getByDates(this.appSession.userId, start, moving, end, DateGrains.Aged30, currentCount, this.itemsPerGroup)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(groupedCourses => {
        Object.keys(groupedCourses).forEach(range => {
          const [startDate] = range.split(' - ');
          console.log('GroupedCourses ----> ', groupedCourses[range]);
          if (moment().diff(moment(startDate), 'months')) {
            if (currentCount == 0) {
              this.latestStartDate = moment(startDate);
              this.lastMonth = groupedCourses[range];
              this.lastMonthMaxItems = groupedCourses[range].totalCount;
              this.setLastMonthShowMoreButtons(this.lastMonth?.items?.length);
            }
            else {
              this.lastMonth.items.push(...groupedCourses[range].items);
              this.setLastMonthShowMoreButtons(this.lastMonth.items?.length);
            }
          }
          else {
            this.latestStartDate = moment(startDate);
            if (currentCount == 0) {
              this.latest = groupedCourses[range];
              this.latestMaxItems = groupedCourses[range].totalCount;
              this.setLatestShowMoreButtons(this.latest?.items?.length);

            } else {
              groupedCourses[range].items.forEach(item => {
                this.latest.items.push(item);
              });
              this.setLatestShowMoreButtons(this.latest?.items?.length);
            }
          }
        });
      });
  }

  private loadPopular(currentCount: number): void {
    this.isPopularLoading = true;
    this._coursesService.getByPopularity(this.appSession.userId, currentCount, this.popularItems)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isPopularLoading = false))
      .subscribe(groupedCourses => {
        if (groupedCourses) {
          Object.keys(groupedCourses).forEach(label => {
            const [startDate] = label.split(' - ');
            console.log('Popular Courses ----> ', groupedCourses[label]);
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
          console.log('NO RESULT');
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

  handleServiceCardClick(course: CourseDto): void {
    this._router.navigate(['app/student-portal' , course.id]);
  }

  handleServiceCardShareClick(service: any): void {
    this.isLoadingCourse = true;
    this._postsService.getAvailableService(service.id)
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingCourse = false))
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
}
