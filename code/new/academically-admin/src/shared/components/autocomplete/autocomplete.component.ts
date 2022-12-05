import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, skip, takeUntil } from 'rxjs/operators';

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
  @Input() minChars: number = 0;

  @Output() onKeywordChange = new EventEmitter<any>();
  @Output() onItemSelect = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  keywordChanged$ = new BehaviorSubject<string>('');
  keyword: string = '';

  isShowChoices = false;

  constructor(
    injector: Injector,
    private _elRef: ElementRef
  ) {
    super(injector);
  }

  get isShown(): boolean { return this.isShowChoices && this.input.value?.length >= this.minChars && !!this.data; }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.keywordChanged$
      .pipe(skip(1))
      .pipe(takeUntil(this.destroyed$))
      .pipe(filter(v => v.length >= this.minChars))
      .pipe(debounceTime(this.inputDelay))
      .pipe(distinctUntilChanged())
      .subscribe(text => {
        this.keyword = text.toLowerCase().trim();
        this.onKeywordChange.next({ keyword: this.keyword, showLoading: true });
        this.isShowChoices = true;
      });

    this.input.addEventListener('focus', () => {
      this.isShowChoices = false;
      const inputValue = this.input.value.toLowerCase().trim();
      if (inputValue.length >= this.minChars) {
        this.isShowChoices = true;
        if (inputValue !== this.keyword) {
          this.keyword = inputValue;
          this.onKeywordChange.next({ keyword: this.keyword, showLoading: false });
        }
      }
    });

    this.input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') this.data = null;
      setTimeout(() => this.keywordChanged$.next(evt.target.value));
    });
  }

  @HostListener('document:click', ['$event.target'])
  onFocusOut(element): void {
    if (!this.input.contains(element) && !this._elRef.nativeElement.contains(element)) {
      this.isShowChoices = false;
    }
  }

  handleOnItemSelect(item: any): void {
    this.onItemSelect.emit(item);
    this.data = null;
    this.input.focus();
  }
}
