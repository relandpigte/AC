import { Injectable } from '@angular/core';
import { ServiceHandoutDto } from '@shared/service-proxies/service-proxies';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PortalHandoutService {
    public newHandoutsCount$: Observable<number>;
    public newHandout$: Observable<ServiceHandoutDto>;

    private _newHandoutsCountSubject: BehaviorSubject<number>;
    private _newHandoutSubject: BehaviorSubject<ServiceHandoutDto>;

    constructor() {
        this._newHandoutsCountSubject = new BehaviorSubject<number>(0);
        this.newHandoutsCount$ = this._newHandoutsCountSubject.asObservable();

        this._newHandoutSubject = new BehaviorSubject<ServiceHandoutDto>(null);
        this.newHandout$ = this._newHandoutSubject.asObservable();
    }

    public set newHandoutsCount(value: number) { this._newHandoutsCountSubject.next(value); }
    public get newHandoutsCountValue(): number { return this._newHandoutsCountSubject.value; }

    public set newHandout(value: ServiceHandoutDto) { this._newHandoutSubject.next(value); }
}
