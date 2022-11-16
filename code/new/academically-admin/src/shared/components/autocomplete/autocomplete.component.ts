import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BehaviorSubject, combineLatest, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() input: any;
  @Input() data: any;
  @Input() noDataText: string;
  @Input() templateRef: any;
  @Input() isLoading: boolean = true;
  @Input() inputDelay: number = 300;
  @Input() isShown = false;

  @Output() onKeywordChange = new EventEmitter<any>();
  @Output() onItemSelect = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  keywordChanged$ = new BehaviorSubject<string>('');
  keyword: string = '';

  constructor(
    injector: Injector,
    private _elRef: ElementRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.keywordChanged$
      .pipe(skip(1))
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(this.inputDelay))
      .pipe(distinctUntilChanged())
      .subscribe(text => this.onKeywordChange.next({
        keyword: text.replace(/ /g, '').toLowerCase().trim(),
        showLoading: true
      }));

    this.input.addEventListener('focus', () => {
      this.onKeywordChange.next({
        keyword: this.input.value.replace(/ /g, '').toLowerCase().trim(),
        showLoading: false
      });
      this.isShown = true;
    });
    this.input.addEventListener('keydown', (evt) => setTimeout(() => this.keywordChanged$.next(evt.target.value.replace(/ /g, '').toLowerCase().trim())));
  }

  @HostListener('document:click', ['$event.target'])
  onFocusOut(element): void {
    if (!this.input.contains(element) && !this._elRef.nativeElement.contains(element)) {
      this.isShown = false;
    }
  }

  handleOnItemSelect(item: any): void {
    this.onItemSelect.emit(item);
    this.onKeywordChange.next({
      keyword: this.input.value.replace(/ /g, '').toLowerCase().trim(),
      showLoading: false
    });
    this.input.focus();
  }
}
