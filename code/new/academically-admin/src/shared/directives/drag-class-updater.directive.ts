import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[dragClassUpdater]'
})
export class DragClassUpdaterDirective implements OnInit {
  @Input() dragClassUpdater: string;

  constructor(private _el: ElementRef) { }

  ngOnInit(): void {
    const container = this._el.nativeElement as HTMLElement;
    container.addEventListener('dragenter', () => {
      container.classList.add(this.dragClassUpdater);
    });
    container.addEventListener('dragleave', () => {
      container.classList.remove(this.dragClassUpdater);
    });
    container.addEventListener('drop', () => {
      container.classList.remove(this.dragClassUpdater);
    });
  }

}
