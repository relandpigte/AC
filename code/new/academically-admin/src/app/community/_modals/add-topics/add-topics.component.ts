import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-add-topics',
    templateUrl: './add-topics.component.html',
    styleUrls: ['./add-topics.component.scss']
  })
  export class AddTopicsComponent implements OnInit {

    activeTab: string = 'more';

    constructor(
      private _router: Router,
      private _modal: BsModalRef,
      private _cdr: ChangeDetectorRef
    ) {
    }
      ngOnInit(): void {
    }

    onCloseClick(): void {
      this._modal.hide();
    }

    navigateToAllTopics(): void {
      this.onCloseClick();
      this._router.navigate(['app', 'community', 'topics' ]);
    }

    setActiveTab(tab: string): void {
      this.activeTab = tab;
      this._cdr.detectChanges();
    }
  }
