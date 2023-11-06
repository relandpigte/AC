import { BehaviorSubject, Subject } from 'rxjs';
import { Utils } from '../helpers/utils';
import { HubEvent, PostDto, PostSort, PostsServiceProxy, PostType, UserTopicDto } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

import { HubService } from '@app/_shared/services/hub.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { AppSessionService } from '@shared/session/app-session.service';

export const MAX_POSTS_TO_LOAD = 15;

export enum pageType {
    all = 'all',
    discussion = 'discussion'
}

export class PostsStateService extends StateServiceBase {
  posts: Map<string, PostDto> = new Map();
  newPosts: Map<string, PostDto> = new Map();
  totalPostsCount: number;

  posts$: Subject<StateUpdate<PostDto>> = new Subject();
  newPosts$: Subject<StateUpdate<PostDto>> = new Subject();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  type: pageType;
  fns = {
    [pageType.all]: 'getAllPostsPaged',
    [pageType.discussion]: 'getAllPostsPaged',
  };

  constructor(
    private _appSession: AppSessionService,
    private _hubService: HubService,
    private _postsService: PostsServiceProxy
  ) {
    super();
  }

  getAllPosts = () => Array.from(this.posts.values());

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

  canViewPost = (post: PostDto): boolean => {
    if (!post) {
      return false;
    }
    const [type, parentId, creationTime] = this.loadArgs;
    return (
      (!type || post.type === type) &&
      (!parentId || post.parentId === parentId) &&
      (!creationTime || post.creationTime.isBefore(creationTime))
    );
  }

  handleNewPosts = async (post: PostDto) => {
    if (!this.canViewPost(post)) {
      return;
    }
    this.loading$.next(true);
    if (this._appSession.userId === post.creatorUserId || !!post.parentId) {
      this.updateFromMap(this.posts, Utils.toObjectMap([post], (p) => p.id, (p) => p), this.posts$);
    } else {
      this.updateFromMap(this.newPosts, Utils.toObjectMap([post], (p) => p.id, (p) => p), this.newPosts$);
    }
    this.loading$.next(false);
  }

  handleNewDiscussionPosts = async (post: PostDto): Promise<void> => {
    if (!this.canViewPost(post)) {
      return;
    }
    this.loading$.next(true);
    this.updateFromMap(this.newPosts, Utils.toObjectMap([post], (p) => p.id, (p) => p), this.newPosts$);
    this.loading$.next(false);
  }

  handleUpdatePosts = async (post: PostDto) => {
    if (!this.canViewPost(post)) return;
    this.loading$.next(true);
    this.updateFromMap(this.posts, Utils.toObjectMap([post], (p) => p.id, (p) => p), this.posts$);
    this.loading$.next(false);
  }

  handleDeletePosts = async (id: string) => {
    if (!this.canViewPost(this.posts.get(id))) return;
    this.loading$.next(true);
    this.updateFromMap(this.posts, { [id]: null }, this.posts$);
    this.loading$.next(false);
  }

  async mergeNewPosts() {
    this.loading$.next(true);
    this.updateFromMap(this.posts, Utils.toObjectMap(Array.from(this.newPosts.values()).filter(p => this.canViewPost(p)), (p) => p.id, (p) => p), this.posts$);
    this.loading$.next(false);
    this.newPosts = new Map();
  }

  async updateServiceParams(params: { type: PostType | undefined, parentId: string | undefined, creationTime: moment.Moment | undefined, postSort: PostSort | undefined, notificationId: string | undefined }) {
    this.loading$.next(true);
    const existingArgs = this.actionArgs['load'];
    this.actionArgs['load'] = [params.type, params.parentId, params.creationTime, params.postSort, params.notificationId, existingArgs[5], existingArgs[6]];
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

  protected async setupSubscriptions(component: any, userId: number) {
    try {
      const hub = await this._hubService.getPostsHub(...this.updateArgs);
      hub.on(HubEvent[HubEvent.PostCreated], this.handleNewPosts);
      hub.on(HubEvent[HubEvent.PostUpdated], this.handleUpdatePosts);
      hub.on(HubEvent[HubEvent.PostDeleted], this.handleDeletePosts);
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}
