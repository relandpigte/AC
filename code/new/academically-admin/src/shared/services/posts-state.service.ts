import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { HubEvent, PostDto, PostsServiceProxy, PostType, UserTopicDto } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

import { HubService } from '@app/_shared/services/hub.service';

import * as moment from 'moment';
import * as _ from 'lodash';

export const MAX_POSTS_TO_LOAD = 15;

export enum pageType {
    all = 'all',
    discussion = 'discussion'
}

export class PostsStateService extends StateServiceBase {
  posts: Map<string, PostDto> = new Map();
  totalPostsCount: number;

  posts$: Subject<StateUpdate<PostDto>> = new Subject();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  type: pageType;
  fns = {
    [pageType.all]: 'getAllPostsPaged',
    [pageType.discussion]: 'getAllPostsPaged',
  };

  constructor(
    private _hubService: HubService,
    private _postsService: PostsServiceProxy
  ) {
    super();
  }

  getAllPosts = (sorting?: { pred?: (p: any) => any; direction?: 'desc' | 'asc'; }) =>
    _.orderBy(
      Array.from(this.posts.values()),
      sorting?.pred ?? ((p) => p.creationTime),
      sorting?.direction ?? 'desc'
    );

  getPostsByType = (type?: PostType, sorting?: { pred: () => any; direction: 'desc' | 'asc' }) =>
    _.orderBy(
      Array.from(this.posts.values()).filter((p) => _.isNil(type) || p.type === type),
      sorting?.pred ?? ((p) => p.creationTime),
      sorting?.direction ?? 'desc'
    );

   getPostsByTopic = async (topics: UserTopicDto[]) => {
    try {
      const selectedTopics = Object.values(topics).map(x => x.disciplineTaxonomyId);
      return await this._postsService.getPostsByTopics(selectedTopics).toPromise();
    } catch (e) {
      console.error(`Error while getting post by topic: ${e}`);
    }
  }

  async loadData(component: any, userId: number) {
    this.loading$.next(true);
    try {
      const posts = await this._postsService[this.fns[this.type ?? pageType.all]](...this.loadArgs).toPromise();
      this.posts = Utils.toMap(posts.items);
      this.totalPostsCount = posts.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  protected async setupSubscriptions(component: any, userId: number) {
    const canViewPost = (post: PostDto): boolean => {
      if (!post) return false;
      const [type, parentId, creationTime] = this.loadArgs;
      return (post.type === type && post.parentId === parentId && post.creationTime.isBefore(creationTime));
    };

    const handleUpsertPosts = async (post: PostDto) => {
      if (!canViewPost(post)) return;
      this.loading$.next(true);
      this.updateFromMap(this.posts, Utils.toObjectMap([post], (p) => p.id, (p) => p), this.posts$)
      this.loading$.next(false);
    };

    const handleDeletePosts = async (id: string) => {
      if (!canViewPost(this.posts[id])) return;
      this.loading$.next(true);
      this.updateFromMap(this.posts, { [id]: null }, this.posts$);
      this.loading$.next(false);
    }

    try {
      const hub = await this._hubService.getPostsHub(...this.updateArgs);
      hub.on(HubEvent[HubEvent.PostCreated], handleUpsertPosts);
      hub.on(HubEvent[HubEvent.PostUpdated], handleUpsertPosts);
      hub.on(HubEvent[HubEvent.PostDeleted], handleDeletePosts);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  async updateServiceParams(params: { type: PostType | undefined, parentId: string | undefined, creationTime: moment.Moment | undefined }) {
    this.loading$.next(true);
    const existingArgs = this.actionArgs['load'];
    this.actionArgs['load'] = [params.type, params.parentId, params.creationTime, existingArgs[3], existingArgs[4]];
    try {
      const posts = await this._postsService[this.fns[this.type ?? pageType.all]](...this.loadArgs).toPromise();
      this.posts = Utils.toMap(posts.items);
      this.totalPostsCount = posts.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  updateChildrenCount(post: PostDto) {
    this._postsService.getCommentsCount(post.id).subscribe(count => post.commentsCount = count)
  }

  pushMorePosts(posts: PostDto[]) {
    this.posts = Utils.toMap([...Array.from(this.posts.values()), ...posts]);
  }

  removePosts(posts: PostDto[]) {
    const removedPosts = posts.map(c => c.id);
    this.posts = Utils.toMap([...Array.from(this.posts.values()).filter(p => !removedPosts.includes(p.id))]);
  }
}
