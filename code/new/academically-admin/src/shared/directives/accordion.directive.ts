import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[accordion]'
})
export class AccordionDirective implements AfterViewInit {
  @Input() collapse = false;
  private _expandIconTemplate = '<i class="fe fe-chevron-down"></i>';
  private _collapseIconTemplate = '<i class="fe fe-chevron-up"></i>';

  constructor(private _el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const self = this;
    const container = $(self._el.nativeElement);
    const collapseButton = container.find('.collapse-button').first();
    const collapseContent = container.find('.collapse-content').first();
    this.toggleCollapse(collapseButton);
    if (self.collapse) {
      collapseContent.hide()
    }
    collapseButton.parent().on('click', () => {
      collapseContent.slideToggle(100, () => {
        this.collapse = !this.collapse;
        this.toggleCollapse(collapseButton);
      });
    });
  }

  private toggleCollapse(collapseButton: JQuery): void {
    const self = this;
    if (self.collapse) {
      collapseButton.html(self._expandIconTemplate);
    } else {
      collapseButton.html(self._collapseIconTemplate);
    }
  }
}
