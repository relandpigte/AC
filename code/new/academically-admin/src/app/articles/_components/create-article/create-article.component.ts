import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ArticleDto, ArticleType } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.less']
})
export class CreateArticleComponent implements OnInit {
  @Input() model = new ArticleDto();
  @Output() createArticle = new EventEmitter<ArticleDto>();
  @Output() createCancel = new EventEmitter();
  isLoading = false;
  ArticleType = ArticleType;

  constructor(
    private _modal: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit(): void {
    this.createArticle.emit(this.model);
    this._modal.hide();
  }

  onCancelClick(): void {
    this.createCancel.emit();
    this._modal.hide();
  }

  onCloseClick(): void {
    this._modal.hide();
  }
}
