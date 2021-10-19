import { Directive, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Options } from 'select2';

@Directive({
  selector: '[select2]'
})
export class Select2Directive implements AfterViewInit {
  @Input() select2options: Options = {};
  @Input() placeholder = 'Select an item';
  @Input() hideSearchBox = false;
  @Output() select2ValueChange: EventEmitter<any> = new EventEmitter();

  private _el: any;
  private _select2: JQuery<any>;

  constructor(
    _element: ElementRef,
  ) {
    this._el = _element.nativeElement;
  }

  @Input() set defaultValue(defaultValue: string) {
    setTimeout(() => {
      if (this._select2) {
        this._select2.val(defaultValue).trigger('change');
      }
    }, 200);
  }

  ngAfterViewInit(): void {
    const self = this;
    const el = self._el;
    if (this.hideSearchBox) {
      this.select2options.minimumResultsForSearch = -1;
    }
    this.select2options.containerCssClass = el.getAttribute('class');
    this.select2options.dropdownAutoWidth = !0;
    this.select2options.dropdownCssClass = el.classList.contains('custom-select-sm') || el.classList.contains('form-control-sm') ? 'dropdown-menu dropdown-menu-sm show' : 'dropdown-menu show';
    this.select2options.dropdownParent = el.closest('.card-body') || document.body;
    this.select2options.placeholder = this.placeholder;
    self._select2 = $(this._el).select2(self.select2options);
    $(this._el).on('select2:select', function (e) {
      self.select2ValueChange.emit(e.params.data.id);
    });
    setTimeout(() => {
      self._select2.val(self.defaultValue).trigger('change');
    });
  }
}
