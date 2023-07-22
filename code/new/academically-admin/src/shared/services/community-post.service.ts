import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ItemToShare {
    serviceId: string,
    paratialInitialState?: any
};

@Injectable({
    providedIn: 'root',
})
export class CommunityPostService {
    public postSubject$ = new Subject<any>();
    public newItemToShare$ = new Subject<ItemToShare>();

    public hasNewPost(post: any): void {
        this.postSubject$.next(post);
    }

    public hasNewItemToShare(item: ItemToShare): void {
        this.newItemToShare$.next(item);
    }
}
