import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[toggableContent]'
})
export class ToggableContentDirective implements OnInit, AfterViewInit {
  @Input() identifier: string;
  @Input() contentClass = 'toggable-content';
  private content: JQuery<any>;
  private expandClass: string;
  private collapseClass: string;
  private expandButtonTemplate: string;
  private collapseButtonTemplate: string;
  private showAllClass = 'show-all';

  constructor(private _el: ElementRef) { }

  ngOnInit(): void {
    this.initActions();

    $(document).on('click', '.profile-menu .nav-item', () => {
      setTimeout(() => {
        this.initContent();
        this.initActions();
      }, 200);
    });
  }

  ngAfterViewInit(): void {
    this.initContent()
  }

  private isOverflown({ clientWidth, clientHeight, scrollWidth, scrollHeight }): boolean {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
  }

  private initContent(): void {
    const container = $(this._el.nativeElement);
    this.content = $(container.find(`.${this.contentClass}`));
    this.content.addClass('toggable-content');
    if (this.isOverflown(this.content[0]) && container.find(`.${this.expandClass}`).length === 0) {
      this.content.after(this.expandButtonTemplate);
    }
  }

  private initActions(): void {
    this.expandClass = `read-more-${this.identifier}`;
    this.expandButtonTemplate = `<a class="${this.expandClass}" href="#">...Read more</a>`;
    $(document).off('click', `.${this.expandClass}`);
    $(document).on('click', `.${this.expandClass}`, (e) => {
      e.preventDefault();
      $(`.${this.expandClass}`).remove();
      this.content.addClass(this.showAllClass);
      this.content.after(this.collapseButtonTemplate);
    });

    this.collapseClass = `read-less-${this.identifier}`;
    this.collapseButtonTemplate = `<a class="${this.collapseClass}" href="#">Read less</a>`;
    $(document).off('click', `.${this.collapseClass}`);
    $(document).on('click', `.${this.collapseClass}`, (e) => {
      e.preventDefault();
      $(`.${this.collapseClass}`).remove();
      this.content.removeClass(this.showAllClass);
      this.content.after(this.expandButtonTemplate);
    });
  }
}
