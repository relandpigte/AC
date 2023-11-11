import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { switchMap, takeUntil } from 'rxjs/operators';

import { HubService } from '@app/_shared/services/hub.service';
import { AppComponentBase } from '@shared/app-component-base';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { PostDto, PostsServiceProxy, SharedType } from '@shared/service-proxies/service-proxies';
import { PostsStateService } from '@shared/services/posts-state.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';
import { PostSorting } from '../discussion/discussion.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent extends AppComponentBase implements OnInit {
  postId: string;
  notificationId: string;

  post: PostDto;
  tempPost: PostDto = this.generateRandomPost() as PostDto;

  isLoading: boolean;

  postsStateService: PostsStateService;
  PostSorting = PostSorting;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _postsService: PostsServiceProxy,
    private _modalService: BsModalService,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
  ) {
    super(injector);
  }

  get postsStateId(): string { return `posts-${this.post.id}`; }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.isLoading = true;
    this._route.queryParamMap
      .pipe(switchMap(query => {
        this.isLoading = true;
        this.notificationId = query.get('n');
        return this._route.paramMap;
      }))
      .pipe(switchMap(params => {
        this.postId = params.get('id');
        return this._postsService.get(this.postId, false, false);
      }))
      .subscribe(async post => {
        this.post = post;
        await this.initPostsAppStates();
        this.isLoading = false;
      },
      (err) => {
        console.error(`Service is not available: ${err}`);
        this.isLoading = false;
      });
  }

  handleSharePost(post: PostDto): void {
    this._postsService.get(post.id, false, false)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(p => {
        const modalSettings = this.defaultModalSettings as ModalOptions<UpsertPostComponent>;
        modalSettings.class = 'modal-lg';
        modalSettings.initialState = {
          allowTabs: false,
          canRemoveAttachment: true,
          title: 'Community.SharePost',
          activeTab: 'quick-post',
          model: {
            sharedPost: p,
            sharedId: p.id,
            sharedType: SharedType.Post
          }
        };
        const share = this._modalService.show(UpsertPostComponent, modalSettings).content;
      });
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
    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoading = loading);
    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (event.data.id !== this.post.id) return;
      switch (event.type) {
        case StateUpdateType.Update:
          this.post = event.data;

          break;
        case StateUpdateType.Delete:
          this._router.navigate(['app', 'community', 'following'])
          break;
      }
      this._cdr.detectChanges();
    });
  }
}
