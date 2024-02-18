import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PortalHandoutService {
    public newHandountsCount$: Observable<number>;

    private _newHandountsCountSubject: BehaviorSubject<number>;

    constructor() {
        this._newHandountsCountSubject = new BehaviorSubject<number>(0);
        this.newHandountsCount$ = this._newHandountsCountSubject.asObservable();
    }

    public set newHandountsCount(value: number) { this._newHandountsCountSubject.next(value); }
}
