import { Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { AppComponentBase } from '@shared/app-component-base';
import { PostDto, PostsServiceProxy, SharedType } from '@shared/service-proxies/service-proxies';
import { UpsertPostComponent } from '@shared/modals/upsert-post/upsert-post.component';
import { MAX_POSTS_TO_LOAD, PostsStateService } from '@shared/services/posts-state.service';
import { HubService } from '@app/_shared/services/hub.service';
import { AppStateConfig, AppStateServices } from '@shared/services/pub-sub.service';
import { StateUpdateType } from '@shared/services/state-base.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent extends AppComponentBase implements OnInit {
  post: PostDto;
  posts: PostDto[] = Array(1).fill([]).map(() => this.generateRandomPost()) as PostDto[];
  postId: string;
  isLoading: boolean;
  postsStateService: PostsStateService;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _postsService: PostsServiceProxy,
    private _modalService: BsModalService,
    private _cdr: ChangeDetectorRef,
    private _hubService: HubService,
    private _router: Router
  ) {
    super(injector);
    this.getPostId();
  }

  get postsStateId(): string { return `posts-${this.postId}`; }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.initPostData();
      await this.initPostsAppStates();
    } catch (e) {
      console.error(`Service is not available: ${e}`);
    }
    this.isLoading = false;
    this._cdr.detectChanges();
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

  private getPostId(): void {
    this._route.paramMap.subscribe(async paramMap => {
      if (paramMap.has('id')) {
        this.postId = paramMap.get('id');
      }
    });
  }

  private async initPostData(): Promise<void> {
    this.post = await this._postsService.get(this.postId, false, false).toPromise();
    this.posts = [this.post];
  }

  private async initPostsAppStates() {
    const appStateConfig: AppStateConfig = {
      [this.postsStateId]: {
        load: [undefined, undefined, undefined, 0, MAX_POSTS_TO_LOAD],
        update: true
      }
    };
    const appStateServices: AppStateServices = {
      [this.postsStateId]: {
        type: PostsStateService,
        args: [this._hubService, this._postsService]
      }
    };
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    await this.pubSubService.start(this, appStateConfig, appStateServices);
    this.postsStateService = this.pubSubService.getStateService<PostsStateService>(this.postsStateId);

    this.postsStateService.loading$.pipe(takeUntil(this.destroyed$)).subscribe(loading => this.isLoading = loading);

    this.postsStateService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(event => {
      switch (event.type) {
        case StateUpdateType.Add:
          this.posts = [event.data].concat(this.posts);
          break;
        case StateUpdateType.Update:
          this.posts = this.posts.map(p => p.id === event.data.id ? event.data : p);
          break;
        case StateUpdateType.Delete:
          setTimeout(() => this._router.navigate(['app', 'community', 'following']), 1000);
          break;
      }
      this._cdr.detectChanges();
    });
  }
}
