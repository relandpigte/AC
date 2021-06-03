import { Directive, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Options } from 'select2';

@Directive({
  selector: '[select2]'
})
export class Select2Directive implements AfterViewInit {
  @Input() select2options: Options = {};
  @Input() defaultValue: any;
  @Input() placeholder = 'Select an item';
  @Output() select2ValueChange: EventEmitter<any> = new EventEmitter();
  private el: any;

  constructor(
    _element: ElementRef,
  ) {
    this.el = _element.nativeElement;
  }

  ngAfterViewInit(): void {
    const self = this;
    const el = self.el;
    // this.select2options.minimumResultsForSearch = -1;
    this.select2options.containerCssClass = el.getAttribute('class');
    this.select2options.dropdownAutoWidth = !0;
    this.select2options.dropdownCssClass = el.classList.contains('custom-select-sm') || el.classList.contains('form-control-sm') ? 'dropdown-menu dropdown-menu-sm show' : 'dropdown-menu show';
    this.select2options.dropdownParent = el.closest('.card-body') || document.body;
    this.select2options.placeholder = this.placeholder;
    const select2 = $(this.el).select2(self.select2options);
    $(this.el).on('select2:select', function (e) {
      self.select2ValueChange.emit(e.params.data.id);
    });
    setTimeout(() => {
      select2.val(self.defaultValue).trigger('change');
    });
  }
}
