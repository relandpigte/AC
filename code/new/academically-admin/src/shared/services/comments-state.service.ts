import { BehaviorSubject, Subject } from "rxjs";
import { Utils } from '../helpers/utils';
import { CommentDto, HubEvent, PostSort, PostsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

import * as _ from 'lodash';

import { HubService } from '@app/_shared/services/hub.service';

export const MAX_REPLIES_TO_LOAD = 5;
export const MAX_COMMENT_LEVELS = 3;

export class CommentsStateService extends StateServiceBase {
  comments: Map<string, CommentDto> = new Map();
  totalCommentsCount: number;

  comments$: Subject<StateUpdate<CommentDto>> = new Subject();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(
    private _hubService: HubService,
    private _postsService: PostsServiceProxy
  ) {
    super();
  }


  getAllComments = () => Array.from(this.comments.values());

  async loadData(component: any, userId: number) {
    this.loading$.next(true);
    try {
      const [referenceId, parentId, postSort, notificationId, skip, count] = this.loadArgs;
      const comments = await this._postsService.getAllCommentsPaged(referenceId, parentId, postSort, notificationId, skip, count).toPromise();
      this.comments = Utils.toMap(comments.items);
      this.totalCommentsCount = comments.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  protected async setupSubscriptions(component: any, userId: number) {
    const handleUpsertComments = async (comment: CommentDto) => {
      this.loading$.next(true);
      this.updateFromMap(this.comments, Utils.toObjectMap([comment], (c) => c.id, (c) => c), this.comments$);
      this.loading$.next(false);
    };

    const handleDeleteComments = async (id: string) => {
      this.loading$.next(true);
      this.updateFromMap(this.comments, { [id]: null }, this.comments$);
      this.loading$.next(false);
    }

    try {
      const hub = await this._hubService.getCommentsHub(...this.updateArgs);
      hub.on(HubEvent[HubEvent.CommentCreated], handleUpsertComments);
      hub.on(HubEvent[HubEvent.CommentUpdated], handleUpsertComments);
      hub.on(HubEvent[HubEvent.CommentDeleted], handleDeleteComments);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  pushMoreComments(comments: CommentDto[]) {
    this.comments = Utils.toMap([...Array.from(this.comments.values()), ...comments]);
  }

  removeComments(comments: CommentDto[]) {
    const removedComments = comments.map(c => c.id);
    this.comments = Utils.toMap([...Array.from(this.comments.values()).filter(c => !removedComments.includes(c.id))]);
  }

  async updateServiceParams(params: { referenceId: string | undefined, parentId: string | undefined, postSort: PostSort | undefined, notificationId: string | undefined }) {
    this.loading$.next(true);
    const existingArgs = this.actionArgs['load'];
    this.actionArgs['load'] = [params.referenceId, params.parentId, params.postSort, params.notificationId, existingArgs[4], existingArgs[5]];
    try {
      const comments = await this._postsService.getAllCommentsPaged(params.referenceId, params.parentId, params.postSort, params.notificationId, existingArgs[4], existingArgs[5]).toPromise();
      this.comments = Utils.toMap(comments.items);
      this.totalCommentsCount = comments.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }
}
