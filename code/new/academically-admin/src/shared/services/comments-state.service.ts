import { HubService } from '@app/_shared/services/hub.service';
import { BehaviorSubject, Subject } from "rxjs";
import { Utils } from '../helpers/utils';
import { CommentDto, HubEvent, PostSort, PostsServiceProxy } from '../service-proxies/service-proxies';
import { StateServiceBase, StateUpdate } from './state-base.service';

export const MAX_REPLIES_TO_LOAD = 5;
export const MAX_COMMENT_LEVELS = 3;

const COMMENTS_HUB_NAME = 'commentsHub';
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

  // this can be used to get level 2 and 3 comments
  getAllComments = () => Array.from(this.comments.values());
  // this can be used to get level 1 comments
  getAllCommentsReversed = () => Array.from(this.comments.values()).reverse();

  async loadData(component: any, userId: number) {
    this.loading$.next(true);
    try {
      const [referenceId, parentId, postSort, notificationId, excludingIds, skip, count] = this.loadArgs;
      const comments = await this._postsService.getAllCommentsPaged(referenceId, parentId, postSort, notificationId, excludingIds, skip, count).toPromise();
      this.comments = Utils.toMap(comments.items.reverse()); // we are reversing here so that the newest comments are at the bottom (as default), maps are ordered by insertion
      this.totalCommentsCount = comments.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }

  handleCreatedComments = async (comment: CommentDto) => {
    this.loading$.next(false);
    this.totalCommentsCount++; // incrementing the total comments count first because the function below triggers the UI to update already
    this.updateFromMap(this.comments, Utils.toObjectMap([comment], (c) => c.id, (c) => c), this.comments$);
    this.loading$.next(false);
  };

  handleUpdateComments = async (comment: CommentDto) => {
    this.loading$.next(false);
    this.updateFromMap(this.comments, Utils.toObjectMap([comment], (c) => c.id, (c) => c), this.comments$);
    this.loading$.next(false);
  };

  handleDeleteComments = async (id: string) => {
    this.loading$.next(false);
    this.totalCommentsCount--; // decrementing the total comments count first because the function below triggers the UI to update already
    this.updateFromMap(this.comments, { [id]: null }, this.comments$);
    this.loading$.next(false);
  }

  async stop() {
    await super.stop();
    if (this.getHub(COMMENTS_HUB_NAME)) {
        this.getHub(COMMENTS_HUB_NAME).off(HubEvent[HubEvent.CommentCreated], this.handleCreatedComments);
        this.getHub(COMMENTS_HUB_NAME).off(HubEvent[HubEvent.CommentUpdated], this.handleUpdateComments);
        this.getHub(COMMENTS_HUB_NAME).off(HubEvent[HubEvent.CommentDeleted], this.handleDeleteComments);
        this.stopHubConnection(COMMENTS_HUB_NAME);
    }
  }

  protected async setupSubscriptions(component: any, userId: number) {
    try {
      this.addHub(COMMENTS_HUB_NAME, await this._hubService.getCommentsHub(...this.updateArgs));
      this.getHub(COMMENTS_HUB_NAME).on(HubEvent[HubEvent.CommentCreated], this.handleCreatedComments);
      this.getHub(COMMENTS_HUB_NAME).on(HubEvent[HubEvent.CommentUpdated], this.handleUpdateComments);
      this.getHub(COMMENTS_HUB_NAME).on(HubEvent[HubEvent.CommentDeleted], this.handleDeleteComments);
      this.startHubConnection(COMMENTS_HUB_NAME);
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  addComments(comments: CommentDto[]) {
    // reverse the comments so that the newest comments are at the bottom (as default), maps are ordered by insertion
    this.comments = Utils.toMap([...comments.reverse(), ...Array.from(this.comments.values())]);
  }

  removeComments(comments: CommentDto[]) {
    const removedComments = comments.map(c => c.id);
    this.comments = Utils.toMap([...Array.from(this.comments.values()).filter(c => !removedComments.includes(c.id))]);
  }

  async updateServiceParams(params: { referenceId: string | undefined, parentId: string | undefined, postSort: PostSort | undefined, notificationId: string | undefined, excludingIds: string[] | undefined }, isSilent = false) {
    this.loading$.next(!isSilent);
    const existingArgs = this.actionArgs['load'];
    this.actionArgs['load'] = [params.referenceId, params.parentId, params.postSort, params.notificationId, params.excludingIds, existingArgs[5], existingArgs[6]];
    try {
      const comments = await this._postsService.getAllCommentsPaged(params.referenceId, params.parentId, params.postSort, params.notificationId, params.excludingIds, existingArgs[5], existingArgs[6]).toPromise();
      // reverse the comments so that the newest comments are at the bottom (as default), maps are ordered by insertion
      this.comments = Utils.toMap(comments.items.reverse());
      this.totalCommentsCount = comments.totalCount;
    } catch (err) {
      console.error(err);
    }
    this.loading$.next(false);
  }
}
