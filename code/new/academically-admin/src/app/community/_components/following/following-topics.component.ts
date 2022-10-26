import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-following-topics',
    templateUrl: './following-topics.component.html',
    styleUrls: ['./following-topics.component.scss']
})
export class FollowingTopicsComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }
}
