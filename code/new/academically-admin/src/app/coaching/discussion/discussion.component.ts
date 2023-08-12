import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { HubService } from '@app/_shared/services/hub.service';
import { PostFiltering, PostSorting, SubscribeType } from '@app/community/discussion/discussion.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ReactionGroup } from '@shared/enums/post/reaction-group.enum';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { PostDto, PostType, PostsServiceProxy } from '@shared/service-proxies/service-proxies';
import { MAX_POSTS_TO_LOAD, PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { WrapperService } from '@shared/services/wrapper.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.less']
})
export class CoachingDiscussionComponent extends AppComponentBase implements OnInit {
  postsStateService: PostsStateService;

  id: string = '08db86a6-73b3-4a55-8965-36ff5f51a85d';

  children: PostDto[] = Array(3).fill([]).map(() => this.generateRandomPost()) as PostDto[];
  totalChildrenCount: number;

  isLoadingChildren$ = new BehaviorSubject<boolean>(true);

  selectedSorting: PostSorting = PostSorting.Latest;
  selectedFiltering: PostFiltering = PostFiltering.All;

  reactionGroup = ReactionGroup;
  postFilteringEnum = PostFiltering;
  postSortingEnum = PostSorting;
  subscribeType = SubscribeType;

  get postsStateId(): string { return `posts-${this.id}`; }
  get postsCount(): number { return this.children?.length ?? 0; }
  get hiddenChildrenCount(): number { return this.totalChildrenCount - this.children.length; }
  get postTypeFilter(): PostType {
    switch(this.selectedFiltering) {
      case PostFiltering.All:
        return undefined;
      case PostFiltering.Post:
        return PostType.QuickPost;
      case PostFiltering.Question:
        return PostType.Question;
      case PostFiltering.Discussion:
        return PostType.Discussion;
    }
  }

  get isLoading$() {
    return of(true);
    // return combineLatest(this.loadingSources$).pipe(switchMap((loaders) => of(loaders.some(l => l))));
  }

  get loadingSources$() {
    return [
      this.isLoadingChildren$
    ];
  }

  constructor(
    injector: Injector,
    private _cdr: ChangeDetectorRef,
    private _modalService: BsModalService,
    private _hubService: HubService,
    private _postsService: PostsServiceProxy,
    private _wrapperService: WrapperService
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.isLoading$.pipe(takeUntil(this.destroyed$)).subscribe(isLoading => this._wrapperService.toggleCanScroll(!isLoading));
    await this.initPostsAppStates();
  }

  private async initPostsAppStates() {
    const appStateConfig: AppStateConfig = {
        [this.postsStateId]: {
            load: [undefined, this.id, undefined, 0, MAX_POSTS_TO_LOAD],
            update: { postId: this.id }
        }
    };
    const appStateServices: AppStateServices = {
        [this.postsStateId]: {
            type: PostsStateService,
            args: [this.appSession, this._hubService, this._postsService]
        }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingChildren$.next(loading));

    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
        if (this.postTypeFilter !== undefined && event.data.type !== this.postTypeFilter) return;
        switch(event.type) {
        case StateUpdateType.Add:
            this.children = [event.data].concat(this.children);
            this.totalChildrenCount++;
            break;
        case StateUpdateType.Update:
            this.children = this.children.map(p => p.id === event.data.id ? event.data : p);
            break;
        case StateUpdateType.Delete:
            this.children = this.children.filter(p => p.id != event.data.id);
            this.totalChildrenCount--;
            break;
        }
        this._cdr.detectChanges();
    });
    this.children = this.postsStateService.getAllPosts();
    this.totalChildrenCount = this.postsStateService.totalPostsCount;
  }

  isSelectedSorting(sort: PostSorting): boolean {
    return this.selectedSorting === sort;
  }

  handleSortingChange(sort: PostSorting): void {
    this.selectedSorting = sort;
  }

  handleAddPost(): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
        parentPostId: this.id,
        allowTabs: false,
        title: 'Community.QuickPost',
        activeTab: 'quick-post'
    };
    const modal = this._modalService.show(UpsertPostComponent, modalSettings).content;
    modal.onPostCreated
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {});
  }

}
