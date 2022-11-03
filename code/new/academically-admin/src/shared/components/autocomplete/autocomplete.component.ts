import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() inputElement: ElementRef;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }
}
