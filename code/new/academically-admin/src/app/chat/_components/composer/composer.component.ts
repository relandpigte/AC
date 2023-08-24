import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.less']
})
export class ComposerComponent extends AppComponentBase implements OnInit {


  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  handleWriteMessage(f: NgForm): void {
    console.log(f.value);
  }

  onMessageKeydown(event: any, f: NgForm): void {
    if (event.keyCode === 13) {
      f.ngSubmit.emit();
      event.preventDefault();
    }

    if (event.keyCode === 27) {
      // Escape - exit writing a message
    }
  }
}
