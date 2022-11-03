import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommunityPostService {
    public postSubject$ = new Subject<any>();

    public hasNewPost(post: any): void {
        this.postSubject$.next(post);
    }
}
