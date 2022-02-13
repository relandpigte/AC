import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  @Input() referenceId: string;

  constructor() { }

  ngOnInit(): void {
  }

}
