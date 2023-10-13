import { Component, Injector, OnInit, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ViewChild } from '@node_modules/@angular/core';
import {
  CommunityDiscussionsComponent
} from '@shared/components/community-discussions/community-discussions.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent extends AppComponentBase implements OnInit {
  @Output() onChildrenUpdate = new EventEmitter();
  @ViewChild(CommunityDiscussionsComponent) commentsContainer: CommunityDiscussionsComponent;

  showComments = true;
  showAddComment = true;
  referenceId = '08dbca3f-8f89-40c6-8a2a-b9c3d0e4d7fd';

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleCommentUpdates(): void {
    this.onChildrenUpdate.emit();
  }

  doToggleComments(): void {
    this.showComments = !this.showComments;
    if (this.showAddComment) {
      this.commentsContainer.doAddComment();
    }
  }
}
