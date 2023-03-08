import { Directive, ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '*[ngWatermark]',
})
export class NgWatermarkDirective implements OnInit, OnChanges {
  constructor(private el: ElementRef) {
    // console.log(el);
  }
  ngOnInit(): void {
    console.log(this.el);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
  }
}
