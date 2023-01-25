import { PostDto, PostsServiceProxy } from '../service-proxies/service-proxies';
import { BehaviorSubject, Subject } from "rxjs";
import { finalize, takeUntil } from 'rxjs/operators';
import { Utils } from '../helpers/utils';
import { NotificationName } from './pub-sub.service';
import { StateServiceBase, StateUpdate } from './state-base.service';

export class PostsStateService extends StateServiceBase {
    posts: Map<string, PostDto> = new Map();
    posts$: Subject<StateUpdate<PostDto>> = new Subject();
    loading$: Subject<boolean> = new BehaviorSubject(false);

    constructor(
        private _postsService: PostsServiceProxy,
    ) {
        super();
    }

    async loadData(c: any, userId: number) {
        this.loading$.next(true);
        this._postsService.getAllPosts(undefined, undefined)
            .pipe(takeUntil(c['destroyed$']))
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(posts => this.posts = Utils.toMap(posts));
    }

    async stop() {
        super.stop();
        this.posts.clear();
    }

    protected async setupSubscriptions(component: any,  userId: number) {

        // .subscribe(async result => {
        //     const facility = Object.values(result.payload)[0] as Facility;
        //     const beaconsMap = Utils.toObjectMap(facility.beacons.map(b => removeBeaconNumberPrefix(b)), b => b.id, b => b);
        //     const updatedIds = Object.keys(beaconsMap);
        //     const deletedBeacons = Array.from(this.beacons.values()).filter(b => !updatedIds.some(id => id === b.id));
        //     const updateMap = Object.assign({} , beaconsMap, Utils.toObjectMap(deletedBeacons, b => b.id, b => null));

        //     this.updateFromMap(this.beacons, updateMap, this.beacons$);
        // });

        return this.eventNotification$
            .subscribe(event => {
                const { name, key } = event;
                switch (name) {
                    case NotificationName.PostCreated:
                        console.error('@@@ subscription created: ', key);
                        break;
                    case NotificationName.PostUpdated:
                        console.error('@@@ subscription updated: ', key);
                        break;
                }
            });
    }
}
