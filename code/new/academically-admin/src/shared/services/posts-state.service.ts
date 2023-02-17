import { BehaviorSubject, Subject } from "rxjs";
import { Utils } from '../helpers/utils';
import { PostDto, PostsServiceProxy, PostType } from '../service-proxies/service-proxies';
import { NotificationName } from './pub-sub.service';
import { StateServiceBase, StateUpdate } from './state-base.service';

import * as _ from 'lodash';

export enum pageType {
    all = 'all',
    discussion = 'discussion'
}

export class PostsStateService extends StateServiceBase {
  posts: Map<string, PostDto> = new Map();
  posts$: Subject<StateUpdate<PostDto>> = new Subject();
  loading$: Subject<boolean> = new BehaviorSubject(false);

  type: pageType;
  fns = {
    [pageType.all]: "getAllPosts",
    [pageType.discussion]: "getAllPosts",
  };

  constructor(private _postsService: PostsServiceProxy) {
    super();
  }

  getAllPosts = (sorting?: {
    pred: (p: any) => any;
    direction: "desc" | "asc";
  }) =>
    _.orderBy(
      Array.from(this.posts.values()),
      sorting?.pred ?? ((p) => p.creationTime),
      sorting?.direction ?? "desc"
    );

  getPostsByType = (
    type?: PostType,
    sorting?: { pred: () => any; direction: "desc" | "asc" }
  ) =>
    _.orderBy(
      Array.from(this.posts.values()).filter(
        (p) => _.isNil(type) || p.type === type
      ),
      sorting?.pred ?? ((p) => p.creationTime),
      sorting?.direction ?? "desc"
    );

  async loadData(component: any, userId: number, fnArgs?: any[]) {
    this.loading$.next(true);
    try {
      const posts = await this._postsService[
        this.fns[this.type ?? pageType.all]
      ](...(fnArgs || [])).toPromise();
      this.posts = Utils.toMap(posts);
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  async stop() {
    super.stop();
    this.posts.clear();
  }

  protected async setupSubscriptions(component: any, userId: number) {
    try {
      await this._postsService.subscribePostChanges().toPromise();
    } catch (err) {
      console.error(err);
    }
    return this.eventNotification$.subscribe(async (event) => {
      this.loading$.next(true);
      const { name, key } = event;
      try {
        switch (name) {
          case NotificationName.PostCreated:
          case NotificationName.PostUpdated:
            const post = await this._postsService.get(key).toPromise();
            this.updateFromMap(
              this.posts,
              Utils.toObjectMap(
                [post],
                (p) => p.id,
                (p) => p
              ),
              this.posts$
            );
            break;
          case NotificationName.PostDeleted:
            this.updateFromMap(this.posts, { [key]: null }, this.posts$);
            break;
        }
      } catch (err) {
        console.error(err);
      }
      this.loading$.next(false);
    });
  }

  protected async closeSubscriptions() {
    try {
      await this._postsService.unsubscribePostChanges().toPromise();
    } catch (err) {
      console.error(err);
    }
  }
}
