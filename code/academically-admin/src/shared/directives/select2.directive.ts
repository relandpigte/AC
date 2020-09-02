import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';
import { Options } from 'select2';

@Directive({
  selector: '[select2]'
})
export class Select2Directive implements AfterViewInit {
  @Input() options: Options = {};
  private el: any;

  constructor(
    private _element: ElementRef,
  ) {
    this.el = _element.nativeElement;
  }

  ngAfterViewInit(): void {
    const el = this.el;
    this.options.minimumResultsForSearch = -1;
    this.options.containerCssClass = el.getAttribute('class');
    this.options.dropdownAutoWidth = !0;
    this.options.dropdownCssClass = el.classList.contains('custom-select-sm') || el.classList.contains('form-control-sm') ? 'dropdown-menu dropdown-menu-sm show' : 'dropdown-menu show';
    this.options.dropdownParent = el.closest('.modal-body') || document.body;
    $(this.el).select2(this.options);
  }
}
