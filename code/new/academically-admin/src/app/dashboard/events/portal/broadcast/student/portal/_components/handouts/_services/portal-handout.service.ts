import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PortalHandoutService {
    public newHandoutsCount$: Observable<number>;

    private _newHandoutsCountSubject: BehaviorSubject<number>;

    constructor() {
        this._newHandoutsCountSubject = new BehaviorSubject<number>(0);
        this.newHandoutsCount$ = this._newHandoutsCountSubject.asObservable();
    }

    public set newHandoutsCount(value: number) { this._newHandoutsCountSubject.next(value); }
    public get newHandoutsCountValue(): number { return this._newHandoutsCountSubject.value; }
}
