import { ChangeDetectorRef, Component, ElementRef, Injector, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CommunityPostCardComponent } from '@shared/components/community-post/community-post.component';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { NotificationDto, NotificationsServiceProxy, PostDto, PostsServiceProxy, SharedType } from '@shared/service-proxies/service-proxies';
import { PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { PostSorting } from '../discussion/discussion.component';

declare var ClassicEditor;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends AppComponentBase implements OnInit, OnDestroy {
  @ViewChildren(CommunityPostCardComponent) postsContainer: CommunityPostCardComponent[];

  postId: string;
  notificationId: string;
  notification: NotificationDto;

  posts: PostDto[] = [];
  tempPost: PostDto = this.generateRandomPost() as PostDto;

  isLoadingPost$ = new BehaviorSubject(false);

  postsStateService: PostsStateService;
  PostSorting = PostSorting;

  constructor(
    injector: Injector,
    private _elRef: ElementRef,
    private _router: Router,
    private _route: ActivatedRoute,
    private _postsService: PostsServiceProxy,
    private _notificationsService: NotificationsServiceProxy,
    private _modalService: BsModalService,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
  ) {
    super(injector);
  }

  get loadingSources$() { return [ this.isLoadingPost$ ]; }
  get isLoading$() {
    return combineLatest(this.loadingSources$)
      .pipe(
        switchMap(loaders =>
          combineLatest([ of(loaders.some(l => l)), ...(this.postsContainer?.map(p => p.commentsContainer.isLoading$) ?? [of(false)]) ])
        )
      )
      .pipe(
        switchMap(loaders => of(loaders.some(l => l)))
      );
  }

  get postsStateId(): string { return `posts-${this.notificationId}`; }


  ngOnInit(): void {
    this.init();
    this.initClassicEditor();
  }

  async ngOnDestroy() {
    await this.postsStateService?.stop();
  }

  private init(): void {
    this.isLoadingPost$.next(true);
    combineLatest([
      this._route.params,
      this._route.queryParamMap
    ])
    .pipe(debounceTime(100)) // debounced so that params and queryparams have time to trigger their events
    .pipe(distinctUntilChanged()) // values should be distinct to avoid unnecessary calls
    .pipe(takeUntil(this.destroyed$))
    .subscribe(async ([params, query]) => {
        this.isLoadingPost$.next(true);
        this.postId = params.id;
        this.notificationId = query.get('n');

        try {
          if (this.notificationId) {
            this.notification = await this._notificationsService.get(this.notificationId).toPromise();
          }
          const ids = this.postId ? [this.postId] : this.notification.sources.map(s => s.referenceId);
          this.posts = await this._postsService.getByIds(ids, this.notificationId ?? undefined, false, false).toPromise();
          await this.initPostsAppStates();
        } catch (err) {
            console.error(err);
        }

        this.isLoadingPost$.next(false);
        this._cdr.detectChanges();
    },
    (err) => {
        console.error(`Error occurred while loading the post: ${err}`);
        this.isLoadingPost$.next(false);
    });
  }

  private initClassicEditor(): void {
    const editor = this._elRef.nativeElement.querySelector('#editor');
    if (editor) {
      ClassicEditor.create(editor).catch( error => console.error( error ));
    }
  }

  handleSharePost(post: PostDto): void {
    const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
    modalSettings.class = 'modal-lg';
    modalSettings.initialState = {
      allowTabs: false,
      canRemoveAttachment: true,
      title: 'Community.SharePost',
      activeTab: 'quick-post',
      model: {
        sharedPost: post,
        sharedId: post.id,
        sharedType: SharedType.Post
      }
    };
    const share = this._modalService.show(UpsertPostComponent, modalSettings).content;
  }

  private async initPostsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.postsStateId]: {
        update: true
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
    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoadingPost$.next(loading));
    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (this.posts.some(p => p.id === event.data.id)) {switch (event.type) {
          case StateUpdateType.Update:
            this.posts = this.posts.map(p => {
              if (p.id === event.data.id) {
                return event.data;
              }
              return p;
            });
            break;
          case StateUpdateType.Delete:
            this._router.navigate(['app', 'community', 'following'])
            break;
        }
        this._cdr.detectChanges();
      }
    });
  }
}
