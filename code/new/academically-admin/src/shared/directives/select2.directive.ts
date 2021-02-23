import { Directive, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Options } from 'select2';

@Directive({
  selector: '[select2]'
})
export class Select2Directive implements AfterViewInit {
  @Input() select2options: Options = {};
  @Input() select2defaultValue: any;
  @Output() select2ValueChange: EventEmitter<any> = new EventEmitter();
  private el: any;

  constructor(
    private _element: ElementRef,
  ) {
    this.el = _element.nativeElement;
  }

  ngAfterViewInit(): void {
    const self = this;
    const el = self.el;
    this.select2options.minimumResultsForSearch = -1;
    this.select2options.containerCssClass = el.getAttribute('class');
    this.select2options.dropdownAutoWidth = !0;
    this.select2options.dropdownCssClass = el.classList.contains('custom-select-sm') || el.classList.contains('form-control-sm') ? 'dropdown-menu dropdown-menu-sm show' : 'dropdown-menu show';
    this.select2options.dropdownParent = el.closest('.modal-body') || document.body;
    $(this.el).select2(self.select2options).val(self.select2defaultValue).trigger('change');
    $(this.el).on('select2:select', function (e) {
      self.select2ValueChange.emit(e.params.data.id);
    });
  }
}
