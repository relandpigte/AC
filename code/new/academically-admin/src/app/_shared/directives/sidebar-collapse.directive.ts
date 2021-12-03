import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[sidebarCollapse]'
})
export class SidebarCollapseDirective implements OnInit {
  @Input() width = '250px';
  @Input() collapseButtonClass = 'btn-sidebar-collapse';
  @Input() showButtonClass = 'btn-sidebar-show';
  @Input() contentClass = 'main-content';
  @Input() marginAdjustment = 'left';

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnInit(): void {
    const self = this;
    $(document).on('click', `.${self.collapseButtonClass}`, function (e) {
      $(self.el.nativeElement).css({ 'width': '0' });
      $(`.${self.contentClass}`).css(`margin-${self.marginAdjustment}`, '0');

      setTimeout(() => {
        $(`.${self.showButtonClass}`).attr('style', 'display: inline-block !important');
      }, 400);
    });

    $(document).on('click', `.${self.showButtonClass}`, function (e) {
      $(this).hide();
      $(self.el.nativeElement).css({ 'width': self.width });
      $(`.${self.contentClass}`).css(`margin-${self.marginAdjustment}`, self.width);
    });
  }

}
