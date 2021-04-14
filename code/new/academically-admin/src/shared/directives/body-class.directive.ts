import { Directive, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[bodyClass]'
})
export class BodyClassDirective implements OnInit {
  @Input() bodyClass: string;

  ngOnInit(): void {
    const self = this;
    document.body.className = self.bodyClass;
  }

}
