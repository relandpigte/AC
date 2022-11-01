import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { Utils } from '@shared/helpers/utils';
import { DisciplineTaxonomiesServiceProxy, DisciplineTaxonomyDto, DisciplineTaxonomyDtoPagedResultDto, UserTopicsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-children-topics',
    templateUrl: './children.component.html',
    styleUrls: ['./children.component.scss']
})
export class ChildrenComponent extends AppComponentBase implements OnInit {
  id: string;

  topic: DisciplineTaxonomyDto;
  clusteredTopics: any = { 'Topic': this.chunkArrayInGroups(Array(15).fill([]).map(() => this.generateRandomCoaching()), 3) };
  pagedTopics: DisciplineTaxonomyDtoPagedResultDto;
  followersMap: Map<string, number> = new Map();

  searchObj: any;

  isLoadingTaxonomyInfo = false;
  isLoadingTopics = false;
  isFollowingTopic = false;
  isSearching = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _taxonomyService: DisciplineTaxonomiesServiceProxy,
    private _userTopics: UserTopicsServiceProxy
  ) {
    super(injector);

    this._route.paramMap.subscribe(paramMap => {
        if (paramMap.has('id')) {
          this.id = paramMap.get('id');
        }
    });
  }

  get loading(): boolean { return this.isLoadingTaxonomyInfo || this.isLoadingTopics || this.isFollowingTopic || this.isSearching; }

  ngOnInit(): void {
    this.loadTaxonomyInfo();
  }

  private

  private loadTaxonomyInfo(): void {
    this.isLoadingTaxonomyInfo = true;

    this._taxonomyService.getAll(this.id, true, 'foryou')
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTaxonomyInfo = false))
      .subscribe(topics => this.clusteredTopics = topics.reduce((topics, t) => ({...topics, [t.name] : this.chunkArrayInGroups(t.children, 3) }), {}));
  }

  getFollowersCount(item: DisciplineTaxonomyDto): number { return this.followersMap.get(item.id) ?? 0; }

  handleOnSearch(searchObj: any): void {
    this.searchObj = searchObj;

    this.isLoadingTopics = true;
    this._taxonomyService.getAllPaged(
      this.id,
      true,
      'recent',
      searchObj?.request?.skipCount,
      searchObj?.request?.maxResultCount
    )
      .pipe(takeUntil(this.destroyed$))
      .pipe(finalize(() => this.isLoadingTopics = false))
      .pipe(switchMap((pagedTopics) => {
          this.pagedTopics = pagedTopics;
          return this._taxonomyService.getFollowerCount(this.pagedTopics.items.map(t => t.id));
      }))
      .subscribe(followers => {
          this.followersMap = Utils.toMap(followers, f => f.disciplineTaxonomyId, f => f.followerCount);
      });
  }

  handleOnFollow(topic: DisciplineTaxonomyDto): void {
    this.isFollowingTopic = true;

    const userTopic = this.pagedTopics.items.find(t => topic.id === t.id);

    if (userTopic) {
        this._userTopics.delete(userTopic.id)
        .pipe(takeUntil(this.destroyed$))
        .pipe(finalize(() => this.isFollowingTopic = false))
        .subscribe(_ => {
            this.notify.info(this.l('Community.Topics.Unfollow.Success', topic.name));
            this.handleOnSearch(this.searchObj);
        });
    }
  }
}
