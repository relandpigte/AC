import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WrapperService {
    public canScroll$ = new BehaviorSubject<boolean>(true);

    public toggleCanScroll(canScroll: boolean): void {
        this.canScroll$.next(canScroll);
    }
}
