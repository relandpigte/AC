import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[bodyClass]'
})
export class BodyClassDirective implements OnInit {
  @Input() bodyClass: string;

  constructor(private el: ElementRef) {

  }

  ngOnInit(): void {
    const self = this;
    document.body.className = self.bodyClass;
  }

}
