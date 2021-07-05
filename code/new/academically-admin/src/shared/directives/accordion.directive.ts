import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[accordion]'
})
export class AccordionDirective implements AfterViewInit {
  @Input() collapse = false;
  private _collapseIconTemplate = '<i class="fe fe-chevron-up rotate"></i>';

  constructor(private _el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const self = this;
    const container = $(self._el.nativeElement);
    const collapseButton = container.find('.collapse-button').first();
    const collapseContent = container.find('.collapse-content').first();
    this.toggleCollapse(collapseButton);
    collapseButton.html(self._collapseIconTemplate);
    if (self.collapse) {
      collapseContent.hide();
    }
    collapseButton.parent().on('click', () => {
      collapseContent.slideToggle(350, () => {
        this.collapse = !this.collapse;

      });
      this.toggleCollapse(collapseButton);
    });
  }

  private toggleCollapse(collapseButton: JQuery): void {
    collapseButton.toggleClass('down');
  }
}
