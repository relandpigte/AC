import { BehaviorSubject, Subject } from "rxjs";
import { Utils } from '../helpers/utils';
import { CommentDto, HubEvent, PostsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

import * as _ from 'lodash';

import { HubService } from '@app/_shared/services/hub.service';

export class CommentsStateService extends StateServiceBase {
  comments: Map<string, CommentDto> = new Map();
  totalCommentsCount: number;

  comments$: Subject<StateUpdate<CommentDto>> = new Subject();
  loading$: Subject<boolean> = new BehaviorSubject(false);

  constructor(
    private _hubService: HubService,
    private _postsService: PostsServiceProxy
  ) {
    super();
  }

  getAllComments = (sorting?: { pred?: (c: any) => any; direction?: 'desc' | 'asc'; }) =>
    _.orderBy(
      Array.from(this.comments.values()),
      sorting?.pred ?? ((c) => c.creationTime),
      sorting?.direction ?? 'desc'
    );

  async loadData(component: any, userId: number) {
    this.loading$.next(true);
    try {
      const [referenceId, parentId, skip, count] = this.loadArgs;
      const comments = await this._postsService.getAllCommentsPaged(referenceId, parentId, skip, count).toPromise();
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
}
