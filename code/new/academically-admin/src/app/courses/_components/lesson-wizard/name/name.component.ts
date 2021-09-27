import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.less']
})
export class NameComponent extends AppComponentBase implements OnInit {
  @Output() courseSaved = new EventEmitter();
  @Output() modalClose = new EventEmitter();
  @Output() backClick = new EventEmitter();

  name: string;
  isLoading = false;

  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.modalClose.emit();
  }

  onBackClick(): void {
    this.backClick.emit();
  }

  onFormSubmit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.notify.success(this.l('SavedSuccessfully'));
      this.courseSaved.emit();
      this.modalClose.emit();
    }, 500);
  }
}
