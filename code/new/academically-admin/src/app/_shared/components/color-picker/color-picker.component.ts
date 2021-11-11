import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent implements OnInit {
  @Input() color: string;
  @Output() colorChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onColorChange(): void {
    this.colorChange.emit(this.color);
  }
}
