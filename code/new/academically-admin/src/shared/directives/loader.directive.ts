import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[loader]'
})
export class LoaderDirective {
  private _loaderTemplate = `
    <div class="loader">
      <div class="spinner-bg"></div>
      <div class="spinner spinner-border" role="status"></div>
    </div>
  `;
  private _loader: JQuery;

  constructor(private _el: ElementRef) { }

  @Input() set loader(isLoading: boolean) {
    const self = this;
    const block = $(self._el.nativeElement);
    if (isLoading) {
      const blockTopMargin = self.getPixelNumberValue(block.css('margin-top'))
        + self.getPixelNumberValue(block.css('padding-top'));
      const blockLeftMargin = self.getPixelNumberValue(block.css('margin-left'))
        + self.getPixelNumberValue(block.css('padding-left'));
      block.addClass('loader-parent');
      self._loader = $(self._loaderTemplate);
      self._loader.css('margin-top', `-${blockTopMargin}px`);
      self._loader.css('margin-left', `-${blockLeftMargin}px`);
      block.prepend(self._loader);
    } else {
      if (this._loader) {
        this._loader.remove();
        block.removeClass('loader-parent');
      }
    }
  }

  private getPixelNumberValue(pixelValue: string): number {
    return +pixelValue.replace('px', '');
  }
}
